import Button from '@repo/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

function usePrevious<T>(value: T): T {
	const ref = useRef<T>({} as T);
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
}

const RemoteComponent = () => {
	const [seconds, setSeconds] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	const onStart = () => {
		setIsRunning(true);
		setIsPaused(false);
	};

	const onPause = () => {
		setIsPaused(true);
		setIsRunning(false);
	};

	const onResume = () => {
		setIsPaused(false);
		setIsRunning(true);
	};

	const onReset = () => {
		setSeconds(0);
		setIsRunning(false);
		setIsPaused(false);
	};

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		if (isRunning && !isPaused) {
			interval = setInterval(() => {
				setSeconds((prev) => prev + 1);
			}, 1000);
		}
		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [isRunning, isPaused]);

	const padded = (num: number) => num.toString().padStart(2, '0');
	const minutes = padded(Math.floor(seconds / 60));
	const secs = padded(seconds % 60);

	const minTens = minutes[0] || '';
	const minOnes = minutes[1] || '';
	const secTens = secs[0] || '';
	const secOnes = secs[1] || '';

	const prevDigits = usePrevious({ minTens, minOnes, secTens, secOnes });

	const digitStyle: React.CSSProperties = {
		width: 30,
		textAlign: 'center',
		display: 'inline-block',
		fontSize: 48,
		fontFamily: 'monospace',
	};

	const Digit = ({ value, prev }: { value: string; prev?: string }) => (
		<AnimatePresence mode="wait">
			<motion.span
				key={value}
				initial={prev !== value ? { opacity: 0, y: -10 } : false}
				animate={{ opacity: 1, y: 0 }}
				exit={prev !== value ? { opacity: 0, y: 10 } : undefined}
				transition={{ duration: 0.2 }}
				style={digitStyle}
			>
				{value}
			</motion.span>
		</AnimatePresence>
	);

	return (
		<div style={{ padding: 24 }}>
			<div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 12 }}>
				<Digit value={minTens} prev={prevDigits.minTens} />
				<Digit value={minOnes} prev={prevDigits.minOnes} />
				<span style={{ fontSize: 48, fontFamily: 'monospace' }}>:</span>
				<Digit value={secTens} prev={prevDigits.secTens} />
				<Digit value={secOnes} prev={prevDigits.secOnes} />
			</div>

			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					gap: 12,
					flexWrap: 'wrap',
					marginTop: 50,
				}}
			>
				{!isRunning && !isPaused && (
					<Button onClick={onStart} outline>
						Start
					</Button>
				)}
				{isRunning && (
					<Button onClick={onPause} outline>
						Pause
					</Button>
				)}
				{isPaused && (
					<Button onClick={onResume} outline>
						Resume
					</Button>
				)}
				<Button onClick={onReset} outline>
					Reset
				</Button>
			</div>
		</div>
	);
};
export default RemoteComponent;
