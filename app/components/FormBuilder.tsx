import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Preview } from './Preview';
import styles from './FormBuilder.module.css';
import { Page, Section, FormField, HeaderConfig, FieldType } from './types';
import { useReactToPrint } from 'react-to-print';
import { Printer, Download, Undo, Redo } from 'lucide-react';
import { PublishButton } from './PublishButton';
import { arrayMove } from '@dnd-kit/sortable';
import { useHistory } from '../hooks/useHistory';

export function FormBuilder() {
    const {
        pages,
        headerConfig,
        pushState,
        undo,
        redo,
        canUndo,
        canRedo
    } = useHistory(
        // Initial Pages
        [{
            id: 'page1',
            sections: [
                {
                    id: 'basic-details',
                    title: 'Basic Entity Details',
                    fields: [
                        { id: 'en', label: 'Entity Name', value: '', type: 'text', boxCount: 30 },
                        { id: 'ra', label: 'Registered Address', value: '', type: 'text', helpText: '(As provided in GST)' },
                        { id: 'rpc', label: 'Pin Code', value: '', type: 'text', boxCount: 6 },
                        { id: 'rcy', label: 'City', value: '', type: 'text', boxCount: 15 },
                        { id: 'rst', label: 'State', value: '', type: 'text', boxCount: 15 },
                        { id: 'msa', label: 'Mailing Address', value: '', type: 'checkbox', options: ['Same as registered address'] },
                        { id: 'ma', label: 'Mailing Address', value: '', type: 'text', helpText: 'If not same' },
                        { id: 'mpc', label: 'Pin Code', value: '', type: 'text', boxCount: 6 },
                        { id: 'mcy', label: 'City', value: '', type: 'text', boxCount: 15 },
                        { id: 'mst', label: 'State', value: '', type: 'text', boxCount: 15 },
                        { id: 'cei', label: 'Company Email ID', value: '', type: 'text', boxCount: 25 },
                        { id: 'cpn', label: 'Company Phone No.', value: '', type: 'text', boxCount: 10 },
                        { id: 'et', label: 'Entity Type', value: '', type: 'checkbox', options: ['Proprietorship', 'Partnership', 'LLP', 'PVT Limited', 'Public Limited', 'Statutory Body', 'Other'] },
                        { id: 'ets', label: 'Please Specify', value: '', type: 'text', helpText: 'If Other', boxCount: 20 },
                        { id: 'nob', label: 'Nature of Business', value: '', type: 'checkbox', options: ['Industrial Activity', 'Business / Professional'] },
                        { id: 'doi', label: 'Date of Incorporation', value: '', type: 'date' },
                        { id: 'it', label: 'Industry Type', value: '', type: 'text', boxCount: 20 },
                        { id: 'to', label: 'Turnover', value: '', type: 'number' },
                        { id: 'at', label: 'Activity Type', value: '', type: 'text', boxCount: 20 },
                        { id: 'ac', label: 'Activity Code', value: '', type: 'text', boxCount: 10 },
                        { id: 'pan', label: 'PAN Number', value: '', type: 'text', boxCount: 10 },
                        { id: 'cin', label: 'CIN / LLPIN', value: '', type: 'text', boxCount: 21 },
                        { id: 'ivp', label: 'Investment in Plant or Property', value: '', type: 'number' },
                        { id: 'gst', label: 'GSTIN', value: '', type: 'text', boxCount: 15 },
                        { id: 'udy', label: 'Udyam Registration No.', value: '', type: 'text', boxCount: 19, helpText: '(If applicable)' },
                        { id: 'ckyc', label: 'KIN / CKYC Number', value: '', type: 'text', boxCount: 14, helpText: '(If applicable)' },
                        { id: 'sez', label: 'Is part of SEZ / DTA / STP', value: '', type: 'checkbox', options: ['Yes', 'No'] },
                    ]
                },
                {
                    id: 'ckyc-consent',
                    title: 'CKYC Consent (Entity)',
                    fields: [
                        { id: 'cc-desc', label: 'Consent Detail', value: '', type: 'text', helpText: 'hereby gives consent to KredX Platform Private Limited to download the CKYC Records from the Central CKYC Registry (CKYCR) and having CKYC provides this consent on the understanding that the data will only be used for verification purposes as outlined above.' },
                        { id: 'cc-name', label: 'CKYC Name', value: '', type: 'text', boxCount: 25 },
                        { id: 'cc-num', label: 'CKYC Number', value: '', type: 'text', boxCount: 14 },
                        { id: 'cc-date', label: 'Date', value: '', type: 'date' },
                        { id: 'cc-sign', label: 'Authorised Signatory as per Board Resolution', value: '', type: 'signature' },
                    ]
                },
                {
                    id: 'proprietors',
                    title: 'Proprietors Monthly Income',
                    fields: [
                        { id: 'mi', label: 'Monthly Income', value: '', type: 'checkbox', options: ['Less than Rs. 50,000', 'Rs. 50,000 to Rs. 75,000', 'Rs. 75,000 to Rs. 1,00,000', 'More than Rs. 1,00,000'], helpText: 'Partner 1 / Partner 2 / Partner 3 / Partner 4' }
                    ]
                },
                {
                    id: 'bank-acc-1',
                    title: 'Bank Account Information (Account 1)',
                    fields: [
                        { id: 'b1-an', label: 'Account Number', value: '', type: 'text', boxCount: 16 },
                        { id: 'b1-bn', label: 'Bank Name', value: '', type: 'text', boxCount: 25 },
                        { id: 'b1-hn', label: 'Account Holder Name', value: '', type: 'text', boxCount: 25 },
                        { id: 'b1-be', label: 'Bank Branch Email ID', value: '', type: 'text', boxCount: 25 },
                        { id: 'b1-cn', label: 'Contact Person Name', value: '', type: 'text', boxCount: 25 },
                        { id: 'b1-cp', label: 'Contact Person Phone', value: '', type: 'text', boxCount: 10 },
                        { id: 'b1-cd', label: 'Contact Person Designation', value: '', type: 'text', boxCount: 15 },
                        { id: 'b1-ifsc', label: 'IFSC', value: '', type: 'text', boxCount: 11 },
                        { id: 'b1-od', label: 'OD / CC Amount', value: '', type: 'number', helpText: '(if applicable)' },
                        { id: 'b1-tl', label: 'Term Loan', value: '', type: 'number', helpText: '(if applicable)' },
                        { id: 'b1-at', label: 'Account Type', value: '', type: 'checkbox', options: ['Working Capital A/C', 'Payment Account', 'Use for auto debit'] },
                    ]
                },
                {
                    id: 'declaration',
                    title: 'Declaration',
                    fields: [
                        { id: 'dec-text', label: 'Declaration', value: '', type: 'text', helpText: 'We hereby declare that the details furnished above are true and correct to the best of our knowledge and belief and we undertake to inform you of any changes therein immediately. In case any of the above information is found to be false or untrue or misleading or misrepresenting, we are aware that we may be held liable for it.' },
                        { id: 'dec-date', label: 'Date', value: '', type: 'date' },
                        { id: 'dec-sign', label: 'Authorised Signatory as per Board Resolution', value: '', type: 'signature', showSignature: true },
                    ]
                }
            ]
        }],
        // Initial Header
        {
            logoText: 'DTX',
            logoHighlight: 'X',
            subHeader: ['DOMESTIC', 'TRADE', 'EXCHANGE'],
            companyName: 'KredX Platform Private Limited',
            formTitle: 'Application Form',
            disclaimer: 'All fields are mandatory. If a field is not applicable, please write "NA" — do not leave any fields blank.'
        }
    );

    const setPages = (value: Page[] | ((prev: Page[]) => Page[])) => {
        const newPages = typeof value === 'function' ? value(pages) : value;
        pushState(newPages, headerConfig);
    };

    const setHeaderConfig = (value: HeaderConfig | ((prev: HeaderConfig) => HeaderConfig)) => {
        const newHeader = typeof value === 'function' ? value(headerConfig) : value;
        pushState(pages, newHeader);
    };

    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: 'Fintech_Form_Application',
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    const updateHeader = (updates: Partial<HeaderConfig>) => {
        setHeaderConfig(prev => ({ ...prev, ...updates }));
    };

    const updateSection = (pageId: string, sectionId: string, updates: Partial<Section>) => {
        setPages(prev => prev.map(page => {
            if (page.id !== pageId) return page;
            return {
                ...page,
                sections: page.sections.map(s => s.id === sectionId ? { ...s, ...updates } : s)
            };
        }));
    };

    const updateField = (pageId: string, sectionId: string, fieldId: string, updates: Partial<FormField>) => {
        setPages(prev => prev.map(page => {
            if (page.id !== pageId) return page;
            return {
                ...page,
                sections: page.sections.map(s => {
                    if (s.id !== sectionId) return s;
                    return {
                        ...s,
                        fields: s.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
                    };
                })
            };
        }));
    };

    const addField = (pageId: string, sectionId: string, type: FieldType = 'text') => {
        const newField: FormField = {
            id: Math.random().toString(36).substr(2, 9),
            label: type === 'signature' ? 'Signature / Photo' : 'New Field',
            value: '',
            type: type,
            boxCount: type === 'text' || type === 'number' ? 10 : undefined,
            checked: type === 'checkbox' ? false : undefined,
            showPhoto: type === 'signature' ? false : undefined,
            showSignature: type === 'signature' ? true : undefined
        };
        setPages(prev => prev.map(page => {
            if (page.id !== pageId) return page;
            return {
                ...page,
                sections: page.sections.map(s => {
                    if (s.id !== sectionId) return s;
                    return { ...s, fields: [...s.fields, newField] };
                })
            };
        }));
    };

    const removeField = (pageId: string, sectionId: string, fieldId: string) => {
        setPages(prev => prev.map(page => {
            if (page.id !== pageId) return page;
            return {
                ...page,
                sections: page.sections.map(s => {
                    if (s.id !== sectionId) return s;
                    return { ...s, fields: s.fields.filter(f => f.id !== fieldId) };
                })
            };
        }));
    };

    const addPage = () => {
        const newPage: Page = {
            id: Math.random().toString(36).substr(2, 9),
            sections: [
                {
                    id: Math.random().toString(36).substr(2, 9),
                    title: 'New Section',
                    fields: [
                        { id: Math.random().toString(36).substr(2, 9), label: 'Field 1', value: '', type: 'text' }
                    ]
                }
            ]
        };
        setPages(prev => [...prev, newPage]);
    };

    const addSection = (pageId: string) => {
        const newSection: Section = {
            id: Math.random().toString(36).substr(2, 9),
            title: 'New Section',
            fields: []
        };
        setPages(prev => prev.map(page => {
            if (page.id !== pageId) return page;
            return { ...page, sections: [...page.sections, newSection] };
        }));
    };

    const removeSection = (pageId: string, sectionId: string) => {
        setPages(prev => prev.map(page => {
            if (page.id !== pageId) return page;
            return { ...page, sections: page.sections.filter(s => s.id !== sectionId) };
        }));
    };

    const removePage = (pageId: string) => {
        setPages(prev => prev.filter(p => p.id !== pageId));
    };

    const reorderFields = (pageId: string, sectionId: string, oldIndex: number, newIndex: number) => {
        setPages(prev => prev.map(page => {
            if (page.id !== pageId) return page;
            return {
                ...page,
                sections: page.sections.map(s => {
                    if (s.id !== sectionId) return s;
                    return { ...s, fields: arrayMove(s.fields, oldIndex, newIndex) };
                })
            };
        }));
    };

    const reorderSections = (pageId: string, oldIndex: number, newIndex: number) => {
        setPages(prev => prev.map(page => {
            if (page.id !== pageId) return page;
            return {
                ...page,
                sections: arrayMove(page.sections, oldIndex, newIndex)
            };
        }));
    };

    const [backgroundColor, setBackgroundColor] = useState('#d1eff1');

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <Sidebar
                    pages={pages}
                    headerConfig={headerConfig}
                    onUpdateSection={updateSection}
                    onUpdateField={updateField}
                    onAddField={addField}
                    onRemoveField={removeField}
                    onAddPage={addPage}
                    onAddSection={addSection}
                    onRemoveSection={removeSection}
                    onRemovePage={removePage}
                    onReorderFields={reorderFields}
                    onReorderSections={reorderSections}
                    onUpdateHeader={updateHeader}
                />

                <div style={{ paddingBottom: '2rem' }}></div>
            </aside>
            <main className={styles.main}>
                {/* Header with Background */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerLeft}>
                            <h1 className={styles.headerTitle}>Form Editor</h1>
                            <p className={styles.headerSubtitle}>
                                {headerConfig.formTitle || 'Untitled Form'}
                            </p>
                        </div>

                        <div className={styles.headerRight}>
                            <div className={styles.undoRedoGroup}>
                                <button
                                    onClick={undo}
                                    disabled={!canUndo}
                                    className={styles.iconButton}
                                    title="Undo"
                                >
                                    <Undo size={18} />
                                </button>
                                <button
                                    onClick={redo}
                                    disabled={!canRedo}
                                    className={styles.iconButton}
                                    title="Redo"
                                >
                                    <Redo size={18} />
                                </button>
                            </div>

                            <div className={styles.colorPickerGroup}>
                                <label className={styles.colorLabel}>Background</label>
                                <input
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    className={styles.colorPicker}
                                />
                            </div>

                            <button
                                onClick={() => handlePrint && handlePrint()}
                                className={styles.secondaryButton}
                            >
                                <Printer size={18} />
                                Export PDF
                            </button>

                            <PublishButton
                                pages={pages}
                                headerConfig={headerConfig}
                                backgroundColor={backgroundColor}
                            />
                        </div>
                    </div>
                </div>

                {/* Preview Area */}
                <div className={styles.previewArea}>
                    <Preview
                        pages={pages}
                        headerConfig={headerConfig}
                        onUpdateField={updateField}
                        onUpdateHeader={updateHeader}
                        ref={componentRef}
                        backgroundColor={backgroundColor}
                    />
                </div>
            </main>
        </div>
    );
}
