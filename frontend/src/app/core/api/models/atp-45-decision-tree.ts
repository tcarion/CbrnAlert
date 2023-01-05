/* tslint:disable */
/* eslint-disable */
import { Atp45Category } from './atp-45-category';
export type Atp45DecisionTree = Atp45Category & {
'children': Array<Atp45DecisionTree>;
};
