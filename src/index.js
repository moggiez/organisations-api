"use strict";

const helpers = require("@moggiez/moggies-lambda-helpers");
const handlers = require("./handlers");

const DEBUG = false;

exports.handler = async function (event, context, callback) {
  const response = helpers.getResponseFn(callback);

  if (DEBUG) {
    response(200, event);
  }

  const httpMethod = event.httpMethod;
  const pathParameters = event.pathParameters;
  const pathParams =
    pathParameters != null && "proxy" in pathParameters && pathParameters.proxy
      ? pathParameters.proxy.split("/")
      : [];
  const organisationId = pathParams[0];
  const userId = pathParams.length > 1 ? pathParams[1] : undefined;
  const payload = JSON.parse(event.body);
  try {
    if (httpMethod == "GET") {
      await handlers.get(organisationId, userId, response);
    } else if (httpMethod == "POST") {
      return await handlers.post(organisationId, userId, payload, response);
    } else if (httpMethod == "PUT" && pathParams.length > 1) {
      await handlers.put(organisationId, userId, payload, response);
    } else if (httpMethod == "DELETE" && pathParams.length > 1) {
      await handlers.delete(organisationId, userId, response);
    } else {
      response(500, "Not supported.");
    }
  } catch (err) {
    response(500, err);
  }
};
