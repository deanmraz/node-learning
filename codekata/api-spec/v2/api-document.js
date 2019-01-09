import { timeout } from '@framework/helpers';
import services from '@app/services';
import _ from 'lodash';

export default class ApiDocument {

  constructor() {
    this.services = services;
    this.docs = services.get('container').all('docs');
    this.application = this._application();
    this.routes = this._routes();
  }

  _getDoc(type, name) {
    return _.get(this.docs, `api/${type}/${name}`)
  }

  _getAll(type) {
    const all = {};
    for (let path in this.docs) {
      if (path.indexOf(`api/${type}`) === 0) {
        const name = path.replace(`api/${type}/`, '');
        all[name] = this.docs[path];
      }
    }
    return all;
  }


  _application() {
    const app = this._getDoc('resources', 'application');
    return {
      name: 'application',
      host: 'localhost',
      namespace: '',
      ...app
    }
  }

  getApp(key, def) {
    return _.get(this.application, key, def);
  }

  _routes() {
    const app = this.application;
    const appMiddelwares = this.getApp('middlewares',[]);
    const resources = this._getAll('resources');
    let routes = [];

    for(let resourceKey in resources) {

      try {
        const resource = resources[resourceKey];
        const resourceRoutes = _.get(resource, 'routes', []);
        const resourceName = _.get(resource, 'name', resourceKey);

        const resourceProtocol = _.get(resource, 'protocol', this.getApp('protocol'));
        const resourceHost = _.get(resource, 'host', this.getApp('host'));
        const resourceNamespace = _.get(resource, 'namespace', this.getApp('namespace'));
        const resourceValidations = _.get(resource, 'validations');

        const resourceMiddlewares = [
          ...appMiddelwares,
          ..._.get(resource, 'middlewares',[]),
        ];

        resourceRoutes.forEach((route) => {

          const routeResourceName = _.get(route, 'resource', resourceName);
          const routeName = _.get(route, 'name');

          // base url
          const protocol = _.get(route, 'protocol', resourceProtocol);
          const host = _.trim(_.get(route, 'host', resourceHost), '/');;
          const basepath = `${protocol}://${host}`;

          // path
          const plural = this.services.get('pluralize')(resourceName);
          let path = '/'+ _.get(route, 'uri', plural);
          const namespace = _.get(route, 'namespace', resourceNamespace);
          if (namespace) {
            path = '/'+_.trim(namespace, '/') + path;
          }
          const fullpath = `${basepath}${path}`;
          const method = _.get(route, 'method');

          const code = _.get(route, 'code', {
            file: `controllers/${routeResourceName}`,
            method: _.camelCase(`${method}`),
          });

          const request = {
            ...this.getApp('request', {}),
            method: method,
            uri: fullpath,
          };

          const response = {
            ...this.getApp('response', {}),
            ..._.get(route, 'response', {}),
          };

          const middlewares = [...new Set([
            ...resourceMiddlewares,
            ..._.get(route, 'middlewares', []),
          ])];

          const routeValidate = {
            'extends': [],
            ..._.get(route, 'validate', {})
          };


          const validate = {

            ...middlewares.reduce((reduced, middleware) => {
              const data = this._getDoc('middlewares', middleware, {});
              return {
                ...reduced,
                ..._.get(data, 'validate', {})
              };
            }, {}),

            // get the extended
            ...routeValidate.extends.reduce((reduced, validate) => {
              return {
                ...reduced,
                ..._.get(resourceValidations, validate, {})
              };
            }, {}),

            ...routeValidate,

          };

          // examples
          let examples = _.get(route, 'examples', [
            { name: 'Default', request: {...request} }
          ]).map((example) => {
            return _.merge({
              route: routeName,
              host: basepath,
              path: path,
              method: method,
              resource: routeResourceName,
              request: _.cloneDeep(request),
              middlewares: _.cloneDeep(middlewares),
              validate: _.cloneDeep(validate),
              response: _.cloneDeep(response),
              code: {
                file: `tests.api.${routeResourceName}`,
                method: _.camelCase(`${method} ${example.name}`),
              }
            }, example);
          });

          let document = {
            name: routeName,
            host: basepath,
            path: path,
            method: method,
            resource: routeResourceName,
            code: code,
            middlewares: middlewares,
            validate: validate,
            request: request,
            response: response,
            examples: examples,
          };

          routes.push(document);
        });
      } catch (e) {
        console.warn(`Document Usage Error:  ${resourceKey}`);
        console.error(e);
      }
    }

    return routes;
  }

  get resources() {
    return _.groupBy(this.routes, 'resource');
  }

  get paths() {
    return _.groupBy(this.routes, 'path');
  }

  getPaths() {
    return Object.keys(this.paths);
  }

  getRoute(path, method) {
    const route = _.get(this.paths, path, []).filter((item) => {
      return item.method.toUpperCase() === method;
    });
    if (route.length > 0) {
      return route[0];
    }
    return null;
  }

  get examples() {
    return this.routes.reduce((reduced, route) => {
      return [
        ...reduced,
        ...route.examples,
      ]
    }, []);
  }

  get models() {
    const prefix = services.get('dynamodb.prefix');
    const models = this._getAll('models');
    let results = [];
    for (let modelName in models) {
      const model = models[modelName];
      const name = _.get(model, 'name', modelName);
      let primary = null;
      let sort = null;
      let relations = [];
      let hasMany = [];
      let belongsTo = [];
      let relateOwner = [];
      const attributes = _.get(model, 'attributes', []).filter((attr) => {
        if (attr.primary) {
          primary = attr;
        }
        if (attr.sort) {
          sort = attr;
        }

        // don't load as attr since all relations are saved as belongs to
        if (attr.type === 'belongsTo') {
          relations.push(attr);
          belongsTo.push(attr);
          if (attr.isOwner) {
            relateOwner.push(attr);
          }
          return false;
        }
        if (attr.type === 'hasMany') {
          relations.push(attr);
          hasMany.push(attr);
          if (attr.isOwner) {
            relateOwner.push(attr);
          }
          return false;
        }

        return true;
      });

      results.push({
        ...model,
        name: `${name}`,
        prefix: `${prefix}`,
        table: `${prefix}_${name}`,
        primary: primary,
        sort: sort,
        attributes: attributes,
        relations: relations,
        hasMany: hasMany,
        belongsTo: belongsTo,
        relateOwner: relateOwner,
      });
    }
    return results;
  }

  getModel(name) {
    const models = this.models;
    const find = models.filter((model) => {
      return name === model.name;
    });
    return find.length > 0 ? find[0] : null;
  }

  getModelNames() {
    const models = this.models;
    return models.map((model) => {
      return model.name;
    });
  }

}
