import { useCallback } from 'react';

export const useSound = () => {
    const playClick = useCallback(() => {
        const soundPath = '/sounds/click.wav';
        console.log('Attempting to play sound from:', soundPath);

        try {
            const audio = new Audio(soundPath);
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
