export interface RouterState {
  [k: string]: any;
}
export interface RoutingAPI {
  url: string;
  state: RouterState;
}
