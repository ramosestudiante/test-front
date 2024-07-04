const helpers = {};
helpers.formatRut = (val) => {
  const rut = val?.replace(/^0+|[^0-9kK]+/g, "").toUpperCase();
  let result = rut ? `${rut.slice(-4, -1)}-${rut.substr(rut?.length - 1)}` : "";

  for (let i = 4; i < rut?.length; i += 3) {
    result = `${rut.slice(-3 - i, -i)}.${result}`;
  }
  if (val?.length <= 2) {
    return result.replace("-", "");
  }
  return result;
};

helpers.normalizeRut = (val) =>
  helpers.formatRut(val).replace(/\./g, "").toUpperCase();

helpers.validateRut = (rut) => {

  if (typeof helpers.normalizeRut(rut) !== "string") {
    return false;
  }

  if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(helpers.normalizeRut(rut))) {
    return false;
  }

  if (helpers.normalizeRut(rut).length < 8) {
    return false;
  }

  const cleanRut = helpers
    .normalizeRut(rut)
    .replace(/^0+|[^0-9kK]+/g, "")
    .toUpperCase();
  let t = parseInt(cleanRut.slice(0, -1), 10);
  let m = 0;
  let s = 1;

  while (t > 0) {
    s = (s + (t % 10) * (9 - (m % 6))) % 11;
    t = Math.floor(t / 10);
    m += 1;
  }

  const v = s > 0 ? `${s - 1}` : "K";
  return v === cleanRut.slice(-1);
};

export default helpers;
