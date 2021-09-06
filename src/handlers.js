"use strict";

const AWS = require("aws-sdk");
const db = require("@moggiez/moggies-db");

const TABLE_CONFIG = {
  tableName: "organisations",
  hashKey: "OrganisationId",
  sortKey: "UserId",
  indexes: {
    UserOrganisations: {
      hashKey: "UserId",
      sortKey: "OrganisationId",
    },
  },
};

const table = new db.Table({ config: TABLE_CONFIG, AWS });

exports.get = async (organisationId, userId, response) => {
  let data = null;
  try {
    if (userId) {
      data = await table.get({ hashKey: organisationId, sortKey: userId });
    } else {
      data = await table.query({ hashKey: organisationId });
    }
    const responseBody =
      "Items" in data
        ? {
            data: data.Items,
          }
        : data.Item;
    response(200, responseBody);
  } catch (err) {
    response(500, err);
  }
};

exports.post = async (organisationId, userId, payload, response) => {
  try {
    const data = await table.create({
      hashKey: organisationId,
      sortKey: userId,
      record: payload,
    });
    response(200, data);
  } catch (err) {
    response(500, err);
  }
};

exports.put = async (organisationId, userId, payload, response) => {
  try {
    const data = table.update({
      hashKey: organisationId,
      sortKey: userId,
      updatedFields: payload,
    });
    response(200, data);
  } catch (err) {
    response(500, err);
  }
};

exports.delete = async (organisationId, userId, response) => {
  try {
    const data = table.delete({ hashKey: organisationId, sortKey: userId });
    response(200, data);
  } catch (err) {
    response(500, err);
  }
};
