/** JSON-only local display snapshots; never persisted or posted to a server. */
export type CompletionDisplayState={confidence:number;difficulty:number;record:{image:string;language:string;identity:string}|null;notice:boolean;error:string}
export type ResumeDisplayState={copied:string;image:string;saved:string}
