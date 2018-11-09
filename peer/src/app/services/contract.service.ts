import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { HttpClient } from '@angular/common/http';

const contract = require("truffle-contract");

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  tallySheetArtifacts;
  TallySheet;

  account = this.web3Ser.account;

  constructor(
    private web3Ser: Web3Service,
    private http: HttpClient
  ) { }

  start() {
  return new Promise( (resolve, rej) => {
    this.http.get('http://localhost:8080/contract').subscribe((res) => {
      this.tallySheetArtifacts = res;
      console.log(res);
      this.TallySheet = contract(this.tallySheetArtifacts);
      this.TallySheet.setProvider(this.web3Ser.web3.currentProvider);
      resolve('set');
  })
  });
}

  test(name: any){
    console.log(this.fromStringToHex("hello"));
  }

  fromStringToHex(string: any): any{
    var hex, i;

    var result = "";
    for (i=0; i<string.length; i++) {
        hex = string.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
  }

  newAccount(name: any): any{
  return this.TallySheet
    .deployed()
    .then(inst => {
      return inst.newAccount((name), {from: this.account, gas: 900000}).then(log =>{console.log(log); return log})
    })
}



}
