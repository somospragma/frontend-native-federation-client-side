import { RoutingAPI } from '../components/routing-api.interface';

export class RoutingNotifier {
  static notifyHost(routingApi: RoutingAPI) {
    this.notify('notifyHost', routingApi);
  }

  static notifyMf(routingApi: RoutingAPI) {
    this.notify('notifyMf', routingApi);
  }

  private static notify(event: string, routingApi: RoutingAPI) {
    const evento = new CustomEvent(event, {
      detail: routingApi,
    });
    document.dispatchEvent(evento);
  }
}
