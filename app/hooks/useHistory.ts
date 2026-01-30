import { useState, useCallback } from 'react';
import { Page, HeaderConfig } from '../components/types';

interface HistoryState {
    pages: Page[];
    headerConfig: HeaderConfig;
}

export function useHistory(initialPages: Page[], initialHeaderConfig: HeaderConfig) {
    const [history, setHistory] = useState<HistoryState[]>([{ pages: initialPages, headerConfig: initialHeaderConfig }]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentState = history[currentIndex] || history[0];

    const pushState = useCallback((pages: Page[], headerConfig: HeaderConfig) => {
        setHistory(prev => {
            const newHistory = prev.slice(0, currentIndex + 1);
            return [...newHistory, { pages, headerConfig }];
        });
        setCurrentIndex(prev => prev + 1);
    }, [currentIndex]);

    const undo = useCallback(() => {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
    }, []);

    const redo = useCallback(() => {
        setCurrentIndex(prev => {
            if (prev < history.length - 1) {
                return prev + 1;
            }
            return prev;
        });
    }, [history.length]);

    return {
        pages: currentState.pages,
        headerConfig: currentState.headerConfig,
        pushState,
        undo,
        redo,
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1,
    };
}
