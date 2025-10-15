/* tslint:disable */
/* eslint-disable */
import { Atp45Category } from './atp-45-category';
import { Atp45DecisionTreeAllOf } from './atp-45-decision-tree-all-of';

/**
 * A tree of `Atp45Category`, representing the decision sequence leading to the final ATP45 case.
 */
export type Atp45DecisionTree = Atp45Category & Atp45DecisionTreeAllOf;
