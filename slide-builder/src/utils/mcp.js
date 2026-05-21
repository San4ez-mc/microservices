function getId(req) {
  return req.body && Object.prototype.hasOwnProperty.call(req.body, "id") ? req.body.id : null;
}

function params(req) {
  return req.body && req.body.params ? req.body.params : req.body || {};
}

function ok(req, result) {
  return {
    jsonrpc: "2.0",
    id: getId(req),
    result
  };
}

function err(req, code, message, data) {
  return {
    jsonrpc: "2.0",
    id: getId(req),
    error: {
      code,
      message,
      data: data || null
    }
  };
}

module.exports = { params, ok, err };
