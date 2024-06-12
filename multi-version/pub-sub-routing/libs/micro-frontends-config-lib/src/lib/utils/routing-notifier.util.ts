import PubSub from 'pubsub-js';
import { RoutingAPI } from '../components/routing-api.interface';
import { ROUTING_CONSTANTS } from './routing.constants';

export class RoutingNotifier {
  static notifyHost(routingApi: RoutingAPI) {
    this.notify(ROUTING_CONSTANTS.NOTIFYHOST, routingApi);
  }

  static notifyMf(routingApi: RoutingAPI) {
    this.notify(ROUTING_CONSTANTS.NOTIFYMF, routingApi);
  }

  private static notify(event: string, routingApi: RoutingAPI) {
    PubSub.publish(event, routingApi);
  }
}
