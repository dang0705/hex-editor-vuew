import {handleError} from "vue";

export class HexaViewer {
  static SPACE = 32;
  static DEL = 127

  constructor(id) {
    this.tableWrapper = document.createElement('div')
    this.tableWrapper.style.height = '80vh';
    this.tableWrapper.style.overflow = 'auto';
    this.table = Object.assign(document.createElement('TABLE'), {id})
    this.table.append(document.createElement('TBODY'))
    this.tableWrapper.append(this.table)
  }

  load(rowData) {
    const fileReader = new FileReader()
    fileReader.readAsBinaryString(rowData)
    fileReader.addEventListener('load', ({target: {result}}) => {
      this.renderTable(result)
    })
  }

  separator() {
    const separator = document.createElement('TD')
    separator.style.backgroundColor = 'black'
    return separator
  }

  renderTable(data) {
    const hexaLine = [];
    const ascIILine = []
    let currentLine;
    for ( let offset = 0, size = data.length; offset < size; offset++ ) {
      const newLine = !(offset % 16)
      if ( newLine ) {
        if ( currentLine ) {
          currentLine.append(this.separator(), ...hexaLine, this.separator(), ...ascIILine)
          this.table.querySelector('tbody').append(currentLine);
          hexaLine.length = 0;
          ascIILine.length = 0
        }
        currentLine = this.createLine(offset.toString(16).padStart(8, '0'))
      }
      // get the offset's UTF-16 code
      const byte = data.charCodeAt(offset)
      hexaLine.push(this.createByteCell(offset, byte))
      ascIILine.push(this.createByteCell(offset, byte, true))
    }
    document.body.append(this.tableWrapper)
  }

  createLine(address) {
    const line = document.createElement('TR')
    line.id = `${this.table.id}-row-${address}`
    const addressCol = document.createElement('TH');
    addressCol.append(address)
    line.append(addressCol)
    return line
  }


  createByteCell(offset,byte,ascii){
    const byteCol = document.createElement('TD')
    const decimalOffset = String(offset);
    byteCol.setAttribute('data-offset',decimalOffset);
    const hexaOffset = offset.toString(16).padStart(8,'0');
    byteCol.setAttribute('title',`${hexaOffset}|${decimalOffset}`)
    const format = ascii ? HexaViewer.bytesToAscii : HexaViewer.bytesToHexa
    byteCol.append(format(byte))
    return byteCol
  }
  static bytesToHexa(bytes){
    return bytes.toString(16).padStart(2,'0')
  }
  static bytesToAscii(bytes){
    return bytes >= HexaViewer.SPACE && bytes <= HexaViewer.DEL ? String.fromCharCode(bytes) : '.'
  }
}
