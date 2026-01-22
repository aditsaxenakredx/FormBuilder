import React, { useState, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { Preview } from './Preview';
import styles from './FormBuilder.module.css';
import { Page, Section, FormField, HeaderConfig, FieldType } from './types';
import { useReactToPrint } from 'react-to-print';
import { Printer, Download } from 'lucide-react';
import { arrayMove } from '@dnd-kit/sortable';

export function FormBuilder() {
    // Header State (Global)
    const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({
        logoText: 'DTX',
        logoHighlight: 'X',
        subHeader: ['DOMESTIC', 'TRADE', 'EXCHANGE'],
        companyName: 'KredX Platform Private Limited',
        formTitle: 'Application Form',
        disclaimer: 'All fields are mandatory. If a field is not applicable, please write "NA" — do not leave any fields blank.'
    });

    const [pages, setPages] = useState<Page[]>([
        {
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
                    id: 'kmp-1',
                    title: 'Key Managerial Personnel – 1',
                    fields: [
                        { id: 'k1-fn', label: 'First Name', value: '', type: 'text', boxCount: 15 },
                        { id: 'k1-ln', label: 'Last Name', value: '', type: 'text', boxCount: 15 },
                        { id: 'k1-dg', label: 'Designation', value: '', type: 'text', boxCount: 15 },
                        { id: 'k1-mn', label: 'Mobile Number', value: '', type: 'text', boxCount: 10 },
                        { id: 'k1-ei', label: 'Email ID', value: '', type: 'text', boxCount: 25 },
                        { id: 'k1-din', label: 'DIN / DPIN', value: '', type: 'text', boxCount: 8 },
                        { id: 'k1-fan', label: 'Father’s Name', value: '', type: 'text', boxCount: 25 },
                        { id: 'k1-pan', label: 'PAN', value: '', type: 'text', boxCount: 10 },
                        { id: 'k1-apt', label: 'Address Proof Type', value: '', type: 'text', boxCount: 15 },
                        { id: 'k1-apn', label: 'Address Proof Number', value: '', type: 'text', boxCount: 15 },
                        { id: 'k1-dob', label: 'Date of Birth', value: '', type: 'date' },
                        { id: 'k1-ad', label: 'Address', value: '', type: 'text' },
                        { id: 'k1-pc', label: 'Pin Code', value: '', type: 'text', boxCount: 6 },
                        { id: 'k1-cy', label: 'City', value: '', type: 'text', boxCount: 15 },
                        { id: 'k1-st', label: 'State', value: '', type: 'text', boxCount: 15 },
                        { id: 'k1-kn', label: 'KIN / CKYC Number', value: '', type: 'text', boxCount: 14 },
                        { id: 'k1-pt', label: 'Personnel Type', value: '', type: 'checkbox', options: ['Senior Management', 'Banker', 'Authorised Signatory', 'Platform User', 'Beneficial Owner'] },
                        { id: 'k1-pst', label: 'Personnel Sub-type', value: '', type: 'checkbox', options: ['Proprietor', 'Manager', 'Partner', 'Director', 'Other'] },
                        { id: 'k1-pa', label: 'Platform Access', value: '', type: 'checkbox', options: ['Maker', 'Checker', 'Viewer', 'Both', 'None'] },
                        { id: 'k1-am', label: 'Authorisation Method', value: '', type: 'checkbox', options: ['Board Resolution', 'Power of Attorney', 'Letter of Authorisation', 'Other'] },
                        { id: 'k1-sign', label: 'Photo & Signature', value: '', type: 'signature', showPhoto: true, showSignature: true },
                    ]
                },
                {
                    id: 'bank-acc-2',
                    title: 'Bank Account Information (Account 2)',
                    fields: [
                        { id: 'b2-an', label: 'Account Number', value: '', type: 'text', boxCount: 16 },
                        { id: 'b2-bn', label: 'Bank Name', value: '', type: 'text', boxCount: 25 },
                        { id: 'b2-hn', label: 'Account Holder Name', value: '', type: 'text', boxCount: 25 },
                        { id: 'b2-be', label: 'Bank Branch Email ID', value: '', type: 'text', boxCount: 25 },
                        { id: 'b2-cn', label: 'Contact Person Name', value: '', type: 'text', boxCount: 25 },
                        { id: 'b2-cp', label: 'Contact Person Phone', value: '', type: 'text', boxCount: 10 },
                        { id: 'b2-cd', label: 'Contact Person Designation', value: '', type: 'text', boxCount: 15 },
                        { id: 'b2-ifsc', label: 'IFSC', value: '', type: 'text', boxCount: 11 },
                        { id: 'b2-od', label: 'OD / CC Amount', value: '', type: 'number', helpText: '(if applicable)' },
                        { id: 'b2-tl', label: 'Term Loan', value: '', type: 'number', helpText: '(if applicable)' },
                        { id: 'b2-at', label: 'Account Type', value: '', type: 'checkbox', options: ['Working Capital A/C', 'Payment Account', 'Use for auto debit'] },
                    ]
                },
                {
                    id: 'kmp-2',
                    title: 'Key Managerial Personnel – 2',
                    fields: [
                        { id: 'k2-fn', label: 'First Name', value: '', type: 'text', boxCount: 15 },
                        { id: 'k2-ln', label: 'Last Name', value: '', type: 'text', boxCount: 15 },
                        { id: 'k2-dg', label: 'Designation', value: '', type: 'text', boxCount: 15 },
                        { id: 'k2-mn', label: 'Mobile Number', value: '', type: 'text', boxCount: 10 },
                        { id: 'k2-ei', label: 'Email ID', value: '', type: 'text', boxCount: 25 },
                        { id: 'k2-din', label: 'DIN / DPIN', value: '', type: 'text', boxCount: 8 },
                        { id: 'k2-fan', label: 'Father’s Name', value: '', type: 'text', boxCount: 25 },
                        { id: 'k2-pan', label: 'PAN', value: '', type: 'text', boxCount: 10 },
                        { id: 'k2-apt', label: 'Address Proof Type', value: '', type: 'text', boxCount: 15 },
                        { id: 'k2-apn', label: 'Address Proof Number', value: '', type: 'text', boxCount: 15 },
                        { id: 'k2-dob', label: 'Date of Birth', value: '', type: 'date' },
                        { id: 'k2-ad', label: 'Address', value: '', type: 'text' },
                        { id: 'k2-pc', label: 'Pin Code', value: '', type: 'text', boxCount: 6 },
                        { id: 'k2-cy', label: 'City', value: '', type: 'text', boxCount: 15 },
                        { id: 'k2-st', label: 'State', value: '', type: 'text', boxCount: 15 },
                        { id: 'k2-kn', label: 'KIN / CKYC Number', value: '', type: 'text', boxCount: 14 },
                        { id: 'k2-pt', label: 'Personnel Type', value: '', type: 'checkbox', options: ['Senior Management', 'Banker', 'Authorised Signatory', 'Platform User', 'Beneficial Owner'] },
                        { id: 'k2-pst', label: 'Personnel Sub-type', value: '', type: 'checkbox', options: ['Proprietor', 'Manager', 'Partner', 'Director', 'Other'] },
                        { id: 'k2-pa', label: 'Platform Access', value: '', type: 'checkbox', options: ['Maker', 'Checker', 'Viewer', 'Both', 'None'] },
                        { id: 'k2-am', label: 'Authorisation Method', value: '', type: 'checkbox', options: ['Board Resolution', 'Power of Attorney', 'Letter of Authorisation', 'Other'] },
                        { id: 'k2-sign', label: 'Photo & Signature', value: '', type: 'signature', showPhoto: true, showSignature: true },
                    ]
                },
                {
                    id: 'kmp-3',
                    title: 'Key Managerial Personnel – 3',
                    fields: [
                        { id: 'k3-fn', label: 'First Name', value: '', type: 'text', boxCount: 15 },
                        { id: 'k3-ln', label: 'Last Name', value: '', type: 'text', boxCount: 15 },
                        { id: 'k3-dg', label: 'Designation', value: '', type: 'text', boxCount: 15 },
                        { id: 'k3-mn', label: 'Mobile Number', value: '', type: 'text', boxCount: 10 },
                        { id: 'k3-ei', label: 'Email ID', value: '', type: 'text', boxCount: 25 },
                        { id: 'k3-din', label: 'DIN / DPIN', value: '', type: 'text', boxCount: 8 },
                        { id: 'k3-fan', label: 'Father’s Name', value: '', type: 'text', boxCount: 25 },
                        { id: 'k3-pan', label: 'PAN', value: '', type: 'text', boxCount: 10 },
                        { id: 'k3-apt', label: 'Address Proof Type', value: '', type: 'text', boxCount: 15 },
                        { id: 'k3-apn', label: 'Address Proof Number', value: '', type: 'text', boxCount: 15 },
                        { id: 'k3-dob', label: 'Date of Birth', value: '', type: 'date' },
                        { id: 'k3-ad', label: 'Address', value: '', type: 'text' },
                        { id: 'k3-pc', label: 'Pin Code', value: '', type: 'text', boxCount: 6 },
                        { id: 'k3-cy', label: 'City', value: '', type: 'text', boxCount: 15 },
                        { id: 'k3-st', label: 'State', value: '', type: 'text', boxCount: 15 },
                        { id: 'k3-kn', label: 'KIN / CKYC Number', value: '', type: 'text', boxCount: 14 },
                        { id: 'k3-pt', label: 'Personnel Type', value: '', type: 'checkbox', options: ['Senior Management', 'Banker', 'Authorised Signatory', 'Platform User', 'Beneficial Owner'] },
                        { id: 'k3-pst', label: 'Personnel Sub-type', value: '', type: 'checkbox', options: ['Proprietor', 'Manager', 'Partner', 'Director', 'Other'] },
                        { id: 'k3-pa', label: 'Platform Access', value: '', type: 'checkbox', options: ['Maker', 'Checker', 'Viewer', 'Both', 'None'] },
                        { id: 'k3-am', label: 'Authorisation Method', value: '', type: 'checkbox', options: ['Board Resolution', 'Power of Attorney', 'Letter of Authorisation', 'Other'] },
                        { id: 'k3-sign', label: 'Photo & Signature', value: '', type: 'signature', showPhoto: true, showSignature: true },
                    ]
                },
                {
                    id: 'platform-user-2',
                    title: 'Platform User – 2',
                    fields: [
                        { id: 'p2-fn', label: 'First Name', value: '', type: 'text', boxCount: 15 },
                        { id: 'p2-ln', label: 'Last Name', value: '', type: 'text', boxCount: 15 },
                        { id: 'p2-mn', label: 'Mobile Number', value: '', type: 'text', boxCount: 10 },
                        { id: 'p2-ei', label: 'Email ID', value: '', type: 'text', boxCount: 25 },
                        { id: 'p2-kn', label: 'KIN / CKYC Number', value: '', type: 'text', boxCount: 14 },
                        { id: 'p2-pan', label: 'PAN', value: '', type: 'text', boxCount: 10 },
                        { id: 'p2-apt', label: 'Address Proof Type', value: '', type: 'text', boxCount: 15 },
                        { id: 'p2-apn', label: 'Address Proof Number', value: '', type: 'text', boxCount: 15 },
                        { id: 'p2-pa', label: 'Platform Access', value: '', type: 'checkbox', options: ['Maker', 'Viewer', 'Checker', 'Both', 'None'] },
                        { id: 'p2-sign', label: 'Photo & Signature', value: '', type: 'signature', showPhoto: true, showSignature: true },
                    ]
                },
                {
                    id: 'kmp-4',
                    title: 'Key Managerial Personnel – 4',
                    fields: [
                        { id: 'k4-fn', label: 'First Name', value: '', type: 'text', boxCount: 15 },
                        { id: 'k4-ln', label: 'Last Name', value: '', type: 'text', boxCount: 15 },
                        { id: 'k4-dg', label: 'Designation', value: '', type: 'text', boxCount: 15 },
                        { id: 'k4-mn', label: 'Mobile Number', value: '', type: 'text', boxCount: 10 },
                        { id: 'k4-ei', label: 'Email ID', value: '', type: 'text', boxCount: 25 },
                        { id: 'k4-din', label: 'DIN / DPIN', value: '', type: 'text', boxCount: 8 },
                        { id: 'k4-fan', label: 'Father’s Name', value: '', type: 'text', boxCount: 25 },
                        { id: 'k4-pan', label: 'PAN', value: '', type: 'text', boxCount: 10 },
                        { id: 'k4-apt', label: 'Address Proof Type', value: '', type: 'text', boxCount: 15 },
                        { id: 'k4-apn', label: 'Address Proof Number', value: '', type: 'text', boxCount: 15 },
                        { id: 'k4-dob', label: 'Date of Birth', value: '', type: 'date' },
                        { id: 'k4-ad', label: 'Address', value: '', type: 'text' },
                        { id: 'k4-pc', label: 'Pin Code', value: '', type: 'text', boxCount: 6 },
                        { id: 'k4-cy', label: 'City', value: '', type: 'text', boxCount: 15 },
                        { id: 'k4-st', label: 'State', value: '', type: 'text', boxCount: 15 },
                        { id: 'k4-kn', label: 'KIN / CKYC Number', value: '', type: 'text', boxCount: 14 },
                        { id: 'k4-pt', label: 'Personnel Type', value: '', type: 'checkbox', options: ['Senior Management', 'Banker', 'Authorised Signatory', 'Platform User', 'Beneficial Owner'] },
                        { id: 'k4-pst', label: 'Personnel Sub-type', value: '', type: 'checkbox', options: ['Proprietor', 'Manager', 'Partner', 'Director', 'Other'] },
                        { id: 'k4-pa', label: 'Platform Access', value: '', type: 'checkbox', options: ['Maker', 'Checker', 'Viewer', 'Both', 'None'] },
                        { id: 'k4-am', label: 'Authorisation Method', value: '', type: 'checkbox', options: ['Board Resolution', 'Power of Attorney', 'Letter of Authorisation', 'Other'] },
                        { id: 'k4-sign', label: 'Photo & Signature', value: '', type: 'signature', showPhoto: true, showSignature: true },
                    ]
                },
                {
                    id: 'platform-user-3',
                    title: 'Platform User – 3',
                    fields: [
                        { id: 'p3-fn', label: 'First Name', value: '', type: 'text', boxCount: 15 },
                        { id: 'p3-ln', label: 'Last Name', value: '', type: 'text', boxCount: 15 },
                        { id: 'p3-mn', label: 'Mobile Number', value: '', type: 'text', boxCount: 10 },
                        { id: 'p3-ei', label: 'Email ID', value: '', type: 'text', boxCount: 25 },
                        { id: 'p3-kn', label: 'KIN / CKYC Number', value: '', type: 'text', boxCount: 14 },
                        { id: 'p3-pan', label: 'PAN', value: '', type: 'text', boxCount: 10 },
                        { id: 'p3-apt', label: 'Address Proof Type', value: '', type: 'text', boxCount: 15 },
                        { id: 'p3-apn', label: 'Address Proof Number', value: '', type: 'text', boxCount: 15 },
                        { id: 'p3-pa', label: 'Platform Access', value: '', type: 'checkbox', options: ['Maker', 'Viewer', 'Checker', 'Both', 'None'] },
                        { id: 'p3-sign', label: 'Photo & Signature', value: '', type: 'signature', showPhoto: true, showSignature: true },
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
        }
    ]);

    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: 'Fintech_Form_Application',
    });

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
                <div className={styles.toolbar}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => handlePrint && handlePrint()}
                            className={styles.printButton}
                        >
                            <Printer size={18} /> Print / Export PDF
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
                            <label>Paper Color:</label>
                            <input
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', width: '30px', height: '30px' }}
                            />
                        </div>
                    </div>
                </div>
                {/* Note: Preview now renders pages internally inside documentContainer */}
                <Preview
                    pages={pages}
                    headerConfig={headerConfig}
                    onUpdateField={updateField}
                    onUpdateHeader={updateHeader}
                    ref={componentRef}
                    backgroundColor={backgroundColor}
                />
            </main>
        </div>
    );
}
