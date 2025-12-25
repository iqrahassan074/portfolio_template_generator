/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type ProfessionType = 
  | 'SOFTWARE_ENGINEER' 
  | 'CREATIVE_DIRECTOR' 
  | 'PRODUCT_DESIGNER' 
  | 'DATA_SCIENTIST' 
  | 'MARKETING_LEAD';

export interface GeneratedSvg {
  id: string;
  content: string;
  prompt: string;
  profession?: ProfessionType;
  timestamp: number;
}

export interface ApiError {
  message: string;
  details?: string;
}