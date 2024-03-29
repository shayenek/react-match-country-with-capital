import { useEffect, useState } from 'react';

import './App.css';

import {
	EUCountriesData,
	NACountriesData,
	SACountriesData,
	AsiaCountriesData,
	AfricaCountriesData,
	OceaniaCountriesData,
} from './data/CountriesData';
import { CountryWithCapital, FlattenedData } from './types';

const shuffleArray = (array: FlattenedData[]) => {
	let curId = array.length;

	while (0 !== curId) {
		const randId = Math.floor(Math.random() * curId);
		curId -= 1;
		const tmp = array[curId];
		array[curId] = array[randId];
		array[randId] = tmp;
	}

	return array;
};

export default function App() {
	const [countriesData, setCountriesData] = useState<CountryWithCapital[]>(EUCountriesData);
	const [gameData, setGameData] = useState<FlattenedData[]>([]);
	const [firstSelection, setFirstSelection] = useState<FlattenedData | null>(null);
	const [secondSelection, setSecondSelection] = useState<FlattenedData | null>(null);
	const [matchedPairs, setMatchedPairs] = useState<number>(0);
	const [chosenGameType, setChosenGameType] = useState<string>('EU');
	const [gameScore, setGameScore] = useState<number>(0);

	useEffect(() => {
		createGameData();
	}, [countriesData]);

	useEffect(() => {
		if (firstSelection && secondSelection) {
			if (firstSelection.matchId !== secondSelection.matchId) {
				setGameData((prevGameData) =>
					prevGameData.map((item) => {
						if (item === firstSelection || item === secondSelection) {
							setGameScore(gameScore - 1);
							return { ...item, mismatched: true };
						} else {
							return item;
						}
					})
				);

				setTimeout(() => {
					setGameData((prevGameData) =>
						prevGameData.map((item) => ({ ...item, mismatched: false }))
					);

					setFirstSelection(null);
					setSecondSelection(null);
				}, 1000);
			} else {
				setGameData((prevGameData) =>
					prevGameData.map((item) => {
						if (item.matchId !== firstSelection.matchId) {
							return item;
						} else {
							setGameScore(gameScore + 1);
							return { ...item, disabled: true };
						}
					})
				);

				setFirstSelection(null);
				setSecondSelection(null);
				setMatchedPairs(matchedPairs + 1);
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [firstSelection, secondSelection]);

	const createGameData = () => {
		const flattenedData: FlattenedData[] = [];
		let id = 0;

		for (const country of countriesData) {
			flattenedData.push({ name: country.country, type: 'country', matchId: id });
			flattenedData.push({ name: country.capital, type: 'capital', matchId: id });
			id++;
		}

		setGameData(shuffleArray(flattenedData));
	};

	const changeCountriesList = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setChosenGameType(e.target.value);

		switch (e.target.value) {
			case 'EU':
				setCountriesData(EUCountriesData);
				break;
			case 'NA':
				setCountriesData(NACountriesData);
				break;
			case 'SA':
				setCountriesData(SACountriesData);
				break;
			case 'AS':
				setCountriesData(AsiaCountriesData);
				break;
			case 'AF':
				setCountriesData(AfricaCountriesData);
				break;
			case 'OC':
				setCountriesData(OceaniaCountriesData);
				break;
			default:
				setCountriesData(EUCountriesData);
				break;
		}
	};

	const resetGame = () => {
		console.log(gameData);
		setGameData([]);
		setFirstSelection(null);
		setSecondSelection(null);
		setMatchedPairs(0);
		setCountriesData(countriesData);
		setGameScore(0);
		createGameData();
	};

	const handleClick = (item: FlattenedData) => {
		if (firstSelection && secondSelection) {
			return;
		}
		if (!firstSelection) {
			setFirstSelection(item);
		} else {
			setSecondSelection(item);
		}
	};

	const totalPairs = countriesData.length;
	const gameComplete = matchedPairs === totalPairs;

	return (
		<div className="App | p-4 md:px-32">
			{gameComplete ? (
				<div className="flex items-center flex-col">
					<h1 className="text-xl md:text-4xl text-white font-bold">Game Complete!</h1>
					<h2 className="text-lg md:text-2xl text-white font-bold">
						You matched <span className="text-sky-500 font-bold">{matchedPairs}</span>{' '}
						out of <span className="text-sky-500 font-bold">{totalPairs}</span> pairs.
						Your final score is{' '}
						<span
							className={
								'text-sky-500 font-bold' +
								(gameScore > 0 ? ' text-green-500' : ' text-red-500')
							}
						>
							{gameScore}
						</span>
						.
					</h2>

					<button
						className="px-8 py-4 mt-12 rounded-lg m-6 bg-sky-500 text-white text-xl font-bold hover:bg-sky-700"
						onClick={resetGame}
					>
						Play Again
					</button>
				</div>
			) : (
				<>
					<div className="flex flex-col">
						<div className="flex justify-center">
							<h1 className="text-xl md:text-4xl text-white font-bold">
								Countries and Capitals
							</h1>
							<button
								className="grow-0 ml-4 bg-red-400 text-md font-bold text-white px-5 hover:bg-red-800 rounded-full md:rounded-lg md:text-lg"
								onClick={resetGame}
							>
								Reset
							</button>
						</div>
						<h2 className="text-lg md:text-2xl text-white font-bold">
							You matched{' '}
							<span className="text-sky-500 font-bold">{matchedPairs}</span> out of{' '}
							<span className="text-sky-500 font-bold">{totalPairs}</span> pairs. Your
							current score is{' '}
							<span
								className={
									'text-sky-500 font-bold' +
									(gameScore < 0 ? ' text-red-500' : '')
								}
							>
								{gameScore}
							</span>
							.
						</h2>
						<select
							className="p-2 rounded-lg m-6"
							onChange={changeCountriesList}
							defaultValue={chosenGameType}
						>
							<option value="EU">Europe</option>
							<option value="NA">North America</option>
							<option value="SA">South America</option>
							<option value="AS">Asia</option>
							<option value="AF">Africa</option>
							<option value="OC">Oceania</option>
						</select>
					</div>

					<div className="game-grid flex flex-wrap justify-center">
						{gameData.map((item, index) => (
							<button
								key={index}
								onClick={() => handleClick(item)}
								className={
									'w-32 md:w-48 h-16 m-2 bg-sky-500 text-white font-bold rounded-lg transition-all duration-400 hover:bg-sky-700' +
									(item.disabled ? ' hidden' : '') +
									(item.mismatched ? '  !bg-red-500' : '') +
									(item === firstSelection ? ' !bg-cyan-950' : '')
								}
							>
								{item.name}
							</button>
						))}
					</div>
				</>
			)}
		</div>
	);
}
