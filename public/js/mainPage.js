// const uzb = document.querySelector('.uzbek');
// const rus = document.querySelector('.russian');


// uzb.addEventListener("click", jscirulat)
// rus.addEventListener("click", jsvucko)


function jsvucko() {
 console.log('Bosildi 111')
  let entered_text;

  entered_text = document.forms[0].latin_text.value;

  entered_text = entered_text.replace(/lj/g,'љ');
  entered_text = entered_text.replace(/Lj/g,'Љ');
  entered_text = entered_text.replace(/LJ/g,'Љ');

  entered_text = entered_text.replace(/nj/g,'њ');
  entered_text = entered_text.replace(/Nj/g,'Њ');
  entered_text = entered_text.replace(/NJ/g,'Њ');

  entered_text = entered_text.replace(/dž/g,'џ');
  entered_text = entered_text.replace(/Dž/g,'Џ');
  entered_text = entered_text.replace(/DŽ/g,'Џ');
    entered_text = entered_text.replace(/q/g,'к');
  entered_text = entered_text.replace(/a/g,'а');
  entered_text = entered_text.replace(/b/g,'б');
  entered_text = entered_text.replace(/c/g,'ц');
  entered_text = entered_text.replace(/č/g,'ч');
  entered_text = entered_text.replace(/ć/g,'ћ');
  entered_text = entered_text.replace(/d/g,'д');
  entered_text = entered_text.replace(/đ/g,'ђ');
  entered_text = entered_text.replace(/e/g,'е');
  entered_text = entered_text.replace(/f/g,'ф');
  entered_text = entered_text.replace(/g/g,'г');
  entered_text = entered_text.replace(/h/g,'х');
  entered_text = entered_text.replace(/i/g,'и');
  entered_text = entered_text.replace(/j/g,'ж');
  entered_text = entered_text.replace(/k/g,'к');
  entered_text = entered_text.replace(/l/g,'л');
  entered_text = entered_text.replace(/m/g,'м');
  entered_text = entered_text.replace(/n/g,'н');
  entered_text = entered_text.replace(/o/g,'о');
  entered_text = entered_text.replace(/p/g,'п');
  entered_text = entered_text.replace(/r/g,'р');
  entered_text = entered_text.replace(/s/g,'с');
  entered_text = entered_text.replace(/š/g,'ш');
  entered_text = entered_text.replace(/t/g,'т');
  entered_text = entered_text.replace(/u/g,'у');
  entered_text = entered_text.replace(/v/g,'в');
  entered_text = entered_text.replace(/z/g,'з');
  entered_text = entered_text.replace(/y/g,'й');

  entered_text = entered_text.replace(/A/g,'А');
  entered_text = entered_text.replace(/B/g,'Б');
  entered_text = entered_text.replace(/C/g,'Ц');
  entered_text = entered_text.replace(/Č/g,'Ч');
  entered_text = entered_text.replace(/Ć/g,'Ћ');
  entered_text = entered_text.replace(/D/g,'Д');
  entered_text = entered_text.replace(/Đ/g,'Ђ');
  entered_text = entered_text.replace(/E/g,'Е');
  entered_text = entered_text.replace(/F/g,'Ф');
  entered_text = entered_text.replace(/G/g,'Г');
  entered_text = entered_text.replace(/H/g,'Х');
  entered_text = entered_text.replace(/I/g,'И');
  entered_text = entered_text.replace(/J/g,'Ж');
  entered_text = entered_text.replace(/K/g,'К');
  entered_text = entered_text.replace(/L/g,'Л');
  entered_text = entered_text.replace(/M/g,'М');
  entered_text = entered_text.replace(/N/g,'Н');
  entered_text = entered_text.replace(/O/g,'О');
  entered_text = entered_text.replace(/P/g,'П');
  entered_text = entered_text.replace(/R/g,'Р');
  entered_text = entered_text.replace(/S/g,'С');
  entered_text = entered_text.replace(/Š/g,'Ш');
  entered_text = entered_text.replace(/T/g,'Т');
  entered_text = entered_text.replace(/U/g,'У');
  entered_text = entered_text.replace(/V/g,'В');
  entered_text = entered_text.replace(/Z/g,'З');
  entered_text = entered_text.replace(/Q/g,'Қ');
    entered_text = entered_text.replace(/Q/g,'Қ');
  document.forms[0].cyrillic_text.value = entered_text;
}
function jscirulat() {
  // do all procssing in this variable -> results show in another window
  document.forms[0].latin_text.value = cyr_to_lat(document.forms[0].cyrillic_text.value);
  console.log('Bosildi 222')
}