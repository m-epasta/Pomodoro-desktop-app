import { useCallback } from 'react';
import clickSound from '../assets/mixkit-fast-double-click-on-mouse-275.wav';

export const useSound = () => {
    const playClick = useCallback(() => {
        try {
            const audio = new Audio(clickSound);
            audio.volume = 0.5;
            audio.play().catch(e => console.error('Audio play failed', e));
        } catch (e) {
            console.error('Failed to play sound', e);
        }
    }, []);

    return { playClick };
};
