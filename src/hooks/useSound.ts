import { useCallback } from 'react';
import clickSound from '../assets/mixkit-fast-double-click-on-mouse-275.wav';

export const useSound = () => {
    const playClick = useCallback(() => {
        console.log('Attempting to play sound from:', clickSound);

        try {
            const audio = new Audio(clickSound);
            audio.volume = 0.5;
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Audio playback started successfully');
                    })
                    .catch(e => {
                        console.error('Audio play promise rejected:', e);
                    });
            }
        } catch (e) {
            console.error('Failed to initialize audio:', e);
        }
    }, []);

    return { playClick };
};
