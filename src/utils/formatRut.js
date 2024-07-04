const formatRut = (rut) => {
  let value = rut.replace(/\./g, "").replace("-", "");

  if (value.match(/^(\d{2})(\d{3}){2}(\w{1})$/)) {
    value = value.replace(/^(\d{2})(\d{3})(\d{3})(\w{1})$/, "$1.$2.$3-$4");
  } else if (value.match(/^(\d)(\d{3}){2}(\w{0,1})$/)) {
    value = value.replace(/^(\d)(\d{3})(\d{3})(\w{0,1})$/, "$1.$2.$3-$4");
  } else if (value.match(/^(\d)(\d{3})(\d{0,2})$/)) {
    value = value.replace(/^(\d)(\d{3})(\d{0,2})$/, "$1.$2.$3");
  } else if (value.match(/^(\d)(\d{0,2})$/)) {
    value = value.replace(/^(\d)(\d{0,2})$/, "$1.$2");
  }
  return value;
};

export default formatRut;
