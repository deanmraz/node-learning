import Container from '@app/container';
import { get, merge, cloneDeep } from 'lodash';
import { Serializer as JSONSerializer } from 'jsonapi-serializer';

class ApiModel {
  constructor(Application, type, route) {
    this.Application = cloneDeep(Application);
    this.type = type;
    this.route = route;
    this.attributes = [
      'name',
      'type',
      'request',
      'response',
      'examples',
    ];
  }

  static create(Application, type, route) {
    return new ApiModel(Application, type, route);
  }

  getApplicationAttribute(attr, defaults = {}) {
    return get(this.Application, attr, defaults);
  }

  getRouteAttribute(attr, defaults = {}) {
    return get(this.route, attr, defaults);
  }

  getRouteApplicationAttr(attr, defaults = {}) {
    const value = this.getRouteAttribute(attr, false);
    if (!value) {
      return this.getApplicationAttribute(attr, defaults);
    }
    return value;
  }

  get request() {
    const request = merge(
      this.getApplicationAttribute('request'),
      this.getRouteAttribute('request')
    );
    request.method = this.getRouteAttribute('method', null);
    request.parameters = this.getRouteAttribute('parameters', null);
    request.validate = this.getRouteAttribute('validate', null);

    const protocol = this.getRouteApplicationAttr('protocol', 'https');
    const host = this.getRouteApplicationAttr('host', null);
    const namespace = this.getRouteApplicationAttr('namespace', null);
    let path = this.getRouteAttribute('path', null);
    if (!path) {
      path = this.type;
    }

    request.url = `${protocol}://${host}/${namespace}/${path}`;
    return request;
  }

  get examples() {
    const request = cloneDeep(this.request);
    delete request.parameters;
    delete request.validate;
    let examples = this.getRouteAttribute('examples', null);
    if (!examples) {
      examples = [{
        request,
        name: 'Default',
      }];
    }
    return examples.map((example) => {
      return merge({ ...request}, { ...example });
    });
  }

  get response() {
    const headers = merge(
      this.getApplicationAttribute('response.headers'),
      this.getRouteAttribute('response.headers')
    );
    let statusCode = this.getRouteAttribute('statusCode', false);
    if (!statusCode) {
      const method = this.getRouteAttribute('method');
      statusCode = this.getApplicationAttribute(
        `response.methods.${method}.statusCode`
      );
    }
    return {
      headers,
      statusCode,
    };
  }

  getAttribute(attr) {
    const value = get(this, attr);
    if (value) {
      return value;
    }
    const route = get(this.route, attr);
    if (route) {
      return route;
    }
    return get(this.Application, attr);
  }

  toJson() {
    return this.attributes.reduce((json, attr) => {
      json[attr] = this.getAttribute(attr);
      return json;
    }, {});
  }
}

export default class Controller {
  static async http(event /*, context*/) {
    try {
      return await Controller.get(event);
    } catch (e) {
      console.error(e);
    }
  }

  static async get(event /*, context*/) {
    const errors = [];
    let doc = get(event, 'queryStringParameters.doc');
    if (!doc) {
      errors.push('doc param required!');
    } else {
      doc = doc.replace('-', '/');
    }
    const Spec = doc ? Container.lookup(doc) : false;
    if (!Spec) {
      errors.push('doc does not exist!');
    }

    if (errors.length > 0) {
      return {
        statusCode: 422,
        body: JSON.stringify({ errors }),
      };
    }

    const { name, host, namespace, protocol, request, response, apis } = Spec;
    const Application = {
      name,
      host,
      namespace,
      protocol,
      request,
      response,
    };

    const collection = [];
    let count = 1;
    apis.forEach((api) => {
      const type = get(api, 'type');
      const routes = get(api, 'routes', []);
      routes.forEach((route) => {
        const model = new ApiModel(Application, type, route).toJson();
        model.id = `apis-${count}`;
        collection.push(model);
        count++;
      });
    });

    const Serializer = new JSONSerializer('apis', {
      attributes: ['name', 'type', 'request', 'response', 'examples'],
    });

    return {
      statusCode: 200,
      body: JSON.stringify(Serializer.serialize(collection)),
    };
  }
}
