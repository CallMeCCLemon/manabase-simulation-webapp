import * as gql from 'gql-query-builder';
import type { SimulateQueryInputs } from '$lib/api/model';

export function createSimulateQuery(props: SimulateQueryInputs): { query: string; variables: unknown } {
	return gql.query({
		operation: 'simulate',
		variables: {
			deckList: props.deckList,
			gameConfiguration: {
				name: 'gameConfiguration',
				type: 'Api_Input_GameConfiguration',
				value: {
					initialHandSize: props.initialHandSize,
					cardsDrawnPerTurn: props.cardsDrawnPerTurn,
					onThePlay: props.onThePlay
				}
			},
			objective: {
				name: 'objective',
				type: 'Api_Input_Objective',
				value: {
					targetTurn: props.targetTurn,
					manaCosts: {
						colorRequirements: props.formattedManaCost,
						genericCost: props.genericManaCost
					}
				}
			}
		},
		fields: [
			'message',
			'successRate',
			{
				checkpoints: ['iterations', 'successes']
			},
			{
				deckStats: [
					'totalCards',
					'lands',
					'nonLands',
					{
						totalManaPips: [
							'whiteMana',
							'blueMana',
							'blackMana',
							'redMana',
							'greenMana',
							'colorlessMana',
							'genericCost'
						]
					}
				]
			}
		]
	});
}