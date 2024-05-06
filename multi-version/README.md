# Microfrontends multi-version con Native Federation

⚠️ Para una mejor experiencia de lectura recomiendo el uso de las siguientes extensiones de VsCode:

- [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid).
- [Markdown Preview Github Styling](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-preview-github-styles)

Esta App contiene una prototipo base usando una arquitectura de microfrontends con **múltiples
versiones** de Angular e incluso usando diferentes **Bibliotecas de Componentes**.

## Arquitectura

Considerando el uso de múltiples versiones de Angular la recomendación es usar una **librería npm** para
compartir elementos reutilizables entre los microfrontends.

```mermaid
graph LR
A["`
    _Host_
    Angular _v16.2_
`"]
-- MF ---> B["`
    _mf-auth_
    Angular v17.13
`"]
A -- MF ---> C["`
    _mf-home_
    Angular v16.2
`"]

A -.-> D[npm-lib]
B -.-> E[npm-lib]
C -.-> F[npm-lib]
```

### Bien, pero ¿cómo se logra esto?

Bueno, para ello se recomienda el uso de **Native Federation** y **angular-elements** para convertir un componente Angular en un **web-component**.
Si vemos lo archivos bootstrap de cada microfrontend encontraremos algo como lo siguiente:

```typescript
import { NgZone } from '@angular/core';

(async () => {
  const app = await createApplication({
    providers: […],
  });

  const mfe2Root = createCustomElement(AppComponent, {
    injector: app.injector,
  });

  customElements.define('mfe2-root', mfe2Root);
})();
```

De esa manera creamos el **web-component**, lo registramos en el **DOM** y lo exponemos en el archivo **federation.config**

```typescript
  exposes: {
    "./web-components": "./src/bootstrap.ts",
  }
```

Finalmente el host define un WrapperComponent encargado de cargar cada microfrontend en el DOM. Cada microfrontend cuenta
con su configuración que será usada para la carga.

```typescript
export interface WrapperConfig {
  remoteName: string;
  exposedModule: string;
  elementName: string;
}

@Component([...])
export class WrapperComponent implements OnInit {
  elm = inject(ElementRef);

  @Input() config = initWrapperConfig;

  async ngOnInit() {
    const { exposedModule, remoteName, elementName } = this.config;

    await loadRemoteModule(remoteName, exposedModule);
    const root = document.createElement(elementName);
    this.elm.nativeElement.appendChild(root);
  }
}
```

Rutas del host:

```typescript
export const APP_ROUTES: Routes = [
  [...],
  {
    path: 'passengers',
    component: WrapperComponent,
    data: {
      config: {
        remoteName: 'mfe2',
        exposedModule: './web-components',
        elementName: 'mfe2-root',
      } as WrapperConfig,
    },
  },
  [...]´
];
```

Para encontrar más detalle sobre esta implementación e incluso sobre la posibilidad de crear microfrontends
**multi-version** y **multi-framework** recomiendo leer este articulo de _Angular Architects_: [Micro Frontends with Modern Angular – Part 2: Multi-Version and Multi-Framework Solutions with Angular Elements and Web Components](https://www.angulararchitects.io/blog/micro-frontends-with-modern-angular-part-2-multi-version-and-multi-framework-solutions-with-angular-elements-and-web-components/)

## Problemas de enrutamiento entre microfrontends y solución

<img
    src="host/src/assets/router-instance-example.png"
    alt="mf instance example"
    style="width: 500px"
    align="right"
  />
Esta solución pinta bien, pero trae consigo un problema de enrutamiento entre microfrontends. Debido a que cada microfront es representado
por un **web-component** y cuenta con sus propios **paquetes**, _genera su propia instancia de enrutamiento local_, es decir, solo conoce sus rutas y no
las externas (del host o de otros microfrontends).

Analizando la problemática se propone compartir el router del host (**quien si conoce las rutas y subrutas de los otros mf**) a los microfrontends por medio del objeto _**globalThis**_.

```typescript
// Host -> app.component.ts

constructor() {
  (globalThis as any).ngZone = inject(NgZone);
  (globalThis as any).router = inject(Router);
}
```

> 💡 Al final esto se traduce en un problema de comunicación.

Cada microfront provee un servicio que usa como valor el router del host:

```typescript
//  bootstrap.ts
const app = await createApplication({
  providers: [
    (globalThis as any).router
      ? { provide: RouterGlobalUtil, useValue: (globalThis as any).router }
      : [],
  ],
});

// router-global-util.ts
@Injectable()
export class RouterGlobalUtil extends Router {}
```

Considerando una mejor experiencia de desarrollo, el RouterGlobal le da manejo a las rutas externas si estas no existen en el microfrontend.

```typescript
// mf-auth -> app.routes.ts
{
  path: '**',
  component: NotFoundComponent,
}

// NotFoundComponent
export class NotFoundComponent {
  private readonly globalRouter = inject(RouterGlobalUtil);
  private readonly location = inject(Location);

  constructor() {
    this.globalRouter.navigate(
      [`${location.pathname.substring(1)}${location.search}`],
      { state: this.location.getState() as RouterState }
    );
  }
}
```

Con esto también le damos soporte al estado del Router, podemos concluir que el uso de este servicio es transparente para el desarrollador.

> ⚠️ **Nota**: _Aunque este enfoque es funcional y fácil de implementar, hay que pensar y cuestionar su uso a futuro, si en algún momento Angular
> lanza una actualización donde la interfaz del Router cambie, quizá podría generar problemas en el enrutamiento_.

## Ejecución

Para correr cel proyecto seguimos los siguientes pasos:

1. Instalar dependencias del host y microfrontends.
2. Instalar dependencias de la librería compartida.
3. Buildear y linkear la librería a cada microfrontend (esto se realiza ya que la librería es local).

   ```bash
   ng build
   ...
   npm link ../libs/dist/micro-frontends-config-lib --legacy-peer-deps
   ```

4. Ejecutar el comando `npm start` en la carpeta **multi-version** para ejecutar el script **run-fronts-angular.js**,
   este script nos permite ejecutar los mf que deseemos junto con el host.
