import React, { useState } from 'react';
import { Plus, GripVertical, Trash2, Menu, FileText, ChevronDown, ChevronRight, Settings, Type, Square, Image as ImageIcon, PenTool, X } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './Sidebar.module.css';
import { Page, Section, FormField, HeaderConfig, FieldType } from './types';

interface SidebarProps {
    pages: Page[];
    headerConfig: HeaderConfig;
    onUpdateSection: (pageId: string, sectionId: string, updates: Partial<Section>) => void;
    onUpdateField: (pageId: string, sectionId: string, fieldId: string, updates: Partial<FormField>) => void;
    onAddField: (pageId: string, sectionId: string, type: FieldType) => void;
    onRemoveField: (pageId: string, sectionId: string, fieldId: string) => void;
    onAddPage: () => void;
    onAddSection: (pageId: string) => void;
    onRemoveSection: (pageId: string, sectionId: string) => void;
    onRemovePage: (pageId: string) => void;
    onReorderFields: (pageId: string, sectionId: string, oldIndex: number, newIndex: number) => void;
    onReorderSections: (pageId: string, oldIndex: number, newIndex: number) => void;
    onUpdateHeader: (updates: Partial<HeaderConfig>) => void;
}

// Separate component for Sortable Field
const SortableFieldItem = ({ field, sectionId, pageId, onUpdateField, onRemoveField }: any) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    // State for local new option input
    const [newOption, setNewOption] = useState('');

    const handleAddOption = () => {
        if (newOption.trim()) {
            const currentOpts = field.options || [];
            onUpdateField(pageId, sectionId, field.id, { options: [...currentOpts, newOption.trim()] });
            setNewOption('');
        }
    };

    return (
        <div ref={setNodeRef} style={style} className={styles.fieldCard}>
            <div className={styles.dragHandle} {...attributes} {...listeners}>
                <GripVertical size={16} />
            </div>
            <div className={styles.cardContent}>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1 rounded">{field.type}</span>
                </div>
                <div className={styles.inputWrapper}>
                    <input
                        className={styles.inputLabel}
                        value={field.label}
                        onChange={(e) => onUpdateField(pageId, sectionId, field.id, { label: e.target.value })}
                        placeholder="Field Label"
                        onPointerDown={(e) => e.stopPropagation()}
                    />
                </div>

                {/* Help Text Toggle and Input */}
                <div className="mt-2" onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                    {field.helpText === undefined ? (
                        <button
                            type="button"
                            className="text-[10px] items-center gap-1 font-semibold text-slate-500 hover:text-accent flex bg-slate-100/50 hover:bg-accent/5 px-2 py-1 rounded transition-all italic border border-transparent hover:border-accent/20"
                            onClick={(e) => {
                                e.stopPropagation();
                                onUpdateField(pageId, sectionId, field.id, { helpText: '' });
                            }}
                        >
                            <Plus size={10} /> Add Description / Help Text
                        </button>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase text-muted font-bold">Helping Text / description</label>
                            <div className="flex items-start gap-1">
                                <textarea
                                    className="flex-1 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none focus:border-accent focus:bg-white transition-colors min-h-[40px]"
                                    value={field.helpText}
                                    onChange={(e) => onUpdateField(pageId, sectionId, field.id, { helpText: e.target.value })}
                                    placeholder="e.g. As per Aadhaar card"
                                    onPointerDown={(e) => e.stopPropagation()}
                                />
                                <button
                                    type="button"
                                    className="text-slate-400 hover:text-red-500 p-1 bg-slate-100 hover:bg-red-50 rounded"
                                    onClick={() => onUpdateField(pageId, sectionId, field.id, { helpText: undefined })}
                                    title="Remove help text"
                                    onPointerDown={(e) => e.stopPropagation()}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {['text', 'number'].includes(field.type) && (
                    <div className={styles.prefillContainer}>
                        <input
                            className={styles.inputValue}
                            value={field.value}
                            onChange={(e) => onUpdateField(pageId, sectionId, field.id, { value: e.target.value })}
                            placeholder="Default value..."
                            onPointerDown={(e) => e.stopPropagation()}
                        />
                    </div>
                )}

                {field.type === 'checkbox' && (
                    <div className="mt-2">
                        <label className="text-xs text-secondary font-medium block mb-1">Options:</label>

                        {/* List of current options as tags */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {(field.options || []).map((opt: string, idx: number) => (
                                <div key={idx} className="bg-slate-100 flex items-center gap-1 px-2 py-1 rounded border border-slate-200">
                                    <span className="text-xs text-slate-700">{opt}</span>
                                    <button
                                        onClick={() => {
                                            const newOpts = [...(field.options || [])];
                                            newOpts.splice(idx, 1);
                                            onUpdateField(pageId, sectionId, field.id, { options: newOpts });
                                        }}
                                        className="text-slate-400 hover:text-red-500"
                                        title="Remove Option"
                                        onPointerDown={(e) => e.stopPropagation()}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add new option input */}
                        <div className="flex items-center gap-1">
                            <input
                                className={styles.inputValue}
                                style={{ flex: 1 }}
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddOption();
                                    }
                                }}
                                placeholder="Type option and press Enter"
                                onPointerDown={(e) => e.stopPropagation()}
                            />
                            <button
                                className="p-1 bg-accent/10 text-accent rounded hover:bg-accent/20"
                                onClick={handleAddOption}
                                title="Add Option"
                                onPointerDown={(e) => e.stopPropagation()}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {['text', 'number', 'date'].includes(field.type) && (
                    <div className="flex items-center gap-2 mt-2">
                        <label className="text-xs text-secondary font-medium whitespace-nowrap">Boxes:</label>
                        <input
                            type="number"
                            className="w-16 text-xs bg-slate-100 p-1 rounded border border-slate-200"
                            value={field.boxCount || ''}
                            onChange={(e) => onUpdateField(pageId, sectionId, field.id, { boxCount: parseInt(e.target.value) || undefined })}
                            placeholder="Auto"
                            onPointerDown={(e) => e.stopPropagation()}
                        />
                    </div>
                )}

                {field.type === 'signature' && (
                    <div className="flex flex-col gap-2 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={field.showPhoto}
                                onChange={(e) => onUpdateField(pageId, sectionId, field.id, { showPhoto: e.target.checked })}
                                onPointerDown={(e) => e.stopPropagation()}
                            />
                            <span className="text-xs text-secondary font-medium">Include Photo Box</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={field.showSignature}
                                onChange={(e) => onUpdateField(pageId, sectionId, field.id, { showSignature: e.target.checked })}
                                onPointerDown={(e) => e.stopPropagation()}
                            />
                            <span className="text-xs text-secondary font-medium">Include Signature Box</span>
                        </label>
                    </div>
                )}
            </div>
            <div className={styles.cardActions}>
                <button className={`${styles.actionButton} ${styles.delete}`} title="Delete" onClick={() => onRemoveField(pageId, sectionId, field.id)}>
                    <Trash2 size={15} />
                </button>
            </div>
        </div>
    );
};

// Sortable Section with Accordion
const SortableSectionItem = ({ section, pageId, onUpdateSection, onUpdateField, onAddField, onRemoveField, onRemoveSection }: any) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: section.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const [isExpanded, setIsExpanded] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);

    const handleAddField = (type: FieldType) => {
        onAddField(pageId, section.id, type);
        setShowAddMenu(false);
        setIsExpanded(true); // Auto expand to show new field
    };

    return (
        <div ref={setNodeRef} style={style} className={styles.section}>
            <div className={styles.sectionHeader}>
                <div className="cursor-grab mr-2 text-secondary" {...attributes} {...listeners}>
                    <Menu size={16} />
                </div>
                <button onClick={() => setIsExpanded(!isExpanded)} className="mr-1 text-secondary">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                <input
                    value={section.title}
                    onChange={(e) => onUpdateSection(pageId, section.id, { title: e.target.value })}
                    className={styles.sectionTitleInput}
                    onPointerDown={(e) => e.stopPropagation()}
                />
                <button onClick={() => onRemoveSection(pageId, section.id)} className="text-red-400 hover:text-red-600 ml-auto p-1">
                    <Trash2 size={14} />
                </button>
            </div>

            {isExpanded && (
                <div className="pl-2 border-l-2 border-slate-100 ml-2 mt-2">
                    <SortableContext items={section.fields.map((f: any) => f.id)} strategy={verticalListSortingStrategy}>
                        {section.fields.map((field: any) => (
                            <SortableFieldItem
                                key={field.id}
                                field={field}
                                sectionId={section.id}
                                pageId={pageId}
                                onUpdateField={onUpdateField}
                                onRemoveField={onRemoveField}
                            />
                        ))}
                    </SortableContext>

                    <div className="relative">
                        <button
                            className={styles.addButton}
                            onClick={() => setShowAddMenu(!showAddMenu)}
                        >
                            <Plus size={16} /> Add Field
                        </button>

                        {showAddMenu && (
                            <div className="absolute top-10 left-0 bg-white shadow-xl rounded-lg border border-slate-200 z-50 w-48 p-2 flex flex-col gap-1">
                                <button className="flex items-center gap-2 p-2 hover:bg-slate-50 text-xs text-left rounded" onClick={() => handleAddField('text')}>
                                    <Type size={14} /> Text Input
                                </button>
                                <button className="flex items-center gap-2 p-2 hover:bg-slate-50 text-xs text-left rounded" onClick={() => handleAddField('checkbox')}>
                                    <Square size={14} /> Checkbox
                                </button>
                                <button className="flex items-center gap-2 p-2 hover:bg-slate-50 text-xs text-left rounded" onClick={() => handleAddField('signature')}>
                                    <PenTool size={14} /> Signature / Photo
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({
    pages,
    headerConfig,
    onUpdateSection,
    onUpdateField,
    onAddField,
    onRemoveField,
    onAddPage,
    onAddSection,
    onRemoveSection,
    onRemovePage,
    onReorderFields,
    onReorderSections,
    onUpdateHeader
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const [headerExpanded, setHeaderExpanded] = useState(false);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        if (active.id !== over.id) {
            // Check for Section Reordering first
            for (const page of pages) {
                const sectionIds = page.sections.map(s => s.id);
                if (sectionIds.includes(active.id.toString()) && sectionIds.includes(over.id.toString())) {
                    const oldIndex = sectionIds.indexOf(active.id.toString());
                    const newIndex = sectionIds.indexOf(over.id.toString());
                    onReorderSections(page.id, oldIndex, newIndex);
                    return;
                }
            }

            // Check for Field Reordering
            for (const page of pages) {
                for (const section of page.sections) {
                    const fieldIds = section.fields.map(f => f.id);
                    if (fieldIds.includes(active.id.toString()) && fieldIds.includes(over.id.toString())) {
                        const oldIndex = fieldIds.indexOf(active.id.toString());
                        const newIndex = fieldIds.indexOf(over.id.toString());
                        onReorderFields(page.id, section.id, oldIndex, newIndex);
                        return;
                    }
                }
            }
        }
    };

    return (
        <div className="w-full pb-20">
            <div className={styles.sidebarHeader}>
                <div className={styles.logoPlaceholder}>
                    <div style={{ width: 24, height: 24, background: 'var(--accent)', borderRadius: 6 }}></div>
                    FintechForm
                </div>
            </div>

            {/* Global Form Settings (Header Config) */}
            <div className="mb-6 border-b border-slate-200 pb-4">
                <button
                    onClick={() => setHeaderExpanded(!headerExpanded)}
                    className="flex items-center gap-2 w-full text-left text-sm font-semibold text-slate-700 mb-2 px-3 py-2 hover:bg-slate-50 rounded transition-colors"
                >
                    {headerExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <Settings size={16} /> Form Settings
                </button>

                {headerExpanded && (
                    <div className="px-4 space-y-3">
                        <div>
                            <label className="text-[10px] uppercase text-muted font-bold block mb-1">Form Title</label>
                            <input
                                className={styles.inputLabel}
                                value={headerConfig.formTitle}
                                onChange={(e) => onUpdateHeader({ formTitle: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase text-muted font-bold block mb-1">Company Name</label>
                            <input
                                className={styles.inputLabel}
                                value={headerConfig.companyName}
                                onChange={(e) => onUpdateHeader({ companyName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase text-muted font-bold block mb-1">Disclaimer</label>
                            <textarea
                                className={styles.inputLabel}
                                value={headerConfig.disclaimer}
                                onChange={(e) => onUpdateHeader({ disclaimer: e.target.value })}
                                rows={2}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase text-muted font-bold block mb-1">Application Date</label>
                            <input
                                className={styles.inputLabel}
                                value={headerConfig.applicationDate || ''}
                                onChange={(e) => onUpdateHeader({ applicationDate: e.target.value })}
                                placeholder="DD/MM/YYYY"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase text-muted font-bold block mb-1">Application Number</label>
                            <input
                                className={styles.inputLabel}
                                value={headerConfig.applicationNumber || ''}
                                onChange={(e) => onUpdateHeader({ applicationNumber: e.target.value })}
                                placeholder="Enter number"
                            />
                        </div>
                    </div>
                )}
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                {pages.map((page, pageIndex) => (
                    <div key={page.id} className="mb-8 border-b-4 border-slate-100 pb-4">
                        <div className="flex items-center gap-2 mb-4 font-bold text-sm uppercase text-muted tracking-wider px-1 justify-between bg-slate-50 p-2 rounded">
                            <span className="flex items-center gap-2"><FileText size={14} /> Page {pageIndex + 1}</span>
                            {pages.length > 1 && (
                                <button onClick={() => onRemovePage(page.id)} title="Delete Page" className="text-red-400 hover:text-red-600">
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>

                        {/* Sections */}
                        <SortableContext items={page.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                            {page.sections.map(section => (
                                <SortableSectionItem
                                    key={section.id}
                                    section={section}
                                    pageId={page.id}
                                    onUpdateSection={onUpdateSection}
                                    onUpdateField={onUpdateField}
                                    onAddField={onAddField}
                                    onRemoveField={onRemoveField}
                                    onRemoveSection={onRemoveSection}
                                />
                            ))}
                        </SortableContext>

                        <button
                            onClick={() => onAddSection(page.id)}
                            className={styles.addButton}
                        >
                            <Plus size={16} /> Add Section
                        </button>
                    </div>
                ))}
            </DndContext>

            <button
                onClick={onAddPage}
                className={styles.addButton}
                style={{ marginTop: '1rem', borderStyle: 'solid', borderWidth: '2px', fontWeight: '600' }}
            >
                <Plus size={18} /> Add New Page
            </button>
        </div>
    );
};
