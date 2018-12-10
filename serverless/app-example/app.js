import Application from '@framework/application';


// should return reference to handler service start method
export default Application.create({

  // only required if you need to load in a certain order
  services: [

  ],

  // application middlewares
  middlewares: [
    '@app/middlewares/logging-routes',
  ],

});
