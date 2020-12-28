
import QrcodeTerminal from "qrcode-terminal"
import { ScanStatus } from 'wechaty-puppet'

const mScan = (qrcode:any, status:any) => {
    if (status === ScanStatus.Waiting) {
      QrcodeTerminal.generate(qrcode, {
        small: true
      }) 
  }
}

export default mScan;