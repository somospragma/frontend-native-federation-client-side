# Microfronteds con Native Federation

Este proyecto contiene una serie de ejemplos de microfrontends con estrategias para **mono-version** y **multi-version**.

Para ello se hace uso de la librería de [@angular-architects/native-federation](https://www.npmjs.com/package/@angular-architects/native-federation).

### Solución para estrategia mono-version

- [mono-version](mono-version/README.md)

### Soluciones para estrategia multi-version

- [custom-events-routing](multi-version/custom-events-routing/README.md): Solución basada en eventos personalizados para la comunicación entre microfrontends.
- [host-rounting-shared](multi-version/host-routing-shared/README.md): Solución basada en compartir el enrutamiento del host hacia los microfrontends.
- [pub-sub-routing](multi-version/pub-sub-routing/README.md): Solución basada en un patrón de publicación/suscripción para la comunicación entre microfrontends.
