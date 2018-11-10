import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../services/web3.service';
import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  gaugeSize = 300;

  thresholdConfig = {
    '0': {color: 'red'},
    '30': {color: 'orange'},
    '80': {color: 'green'},
};

  constructor(
    private web3Service: Web3Service,
    private contractService: ContractService,
  ) { }

  acc: any;

  capa1: any;
  currentValue1 = 10;

  capa2: any;
  currentValue2 = 10;

  usage1: any;
  usage2: any;

  balance: any;

  used1 = 0;

  ngOnInit() {
    this.web3Service.getAccounts().subscribe(accs => {
      this.acc = accs[1];
      this.contractService.start().then((res) =>{
        this.contractService.newProsumer(this.acc).then((res) => {
          this.contractService.addNewStorage(1,1,0, this.acc).then(res => {
            this.contractService.getCapaOfMyStorage(0, this.acc).then(res => {
              this.capa1 = res.toString();
            });
          });
          this.contractService.addNewStorage(1,1,200, this.acc).then(res => {
            this.contractService.getCapaOfMyStorage(1, this.acc).then(res => {
              this.capa2 = res.toString();
            });
          });
          this.contractService.balanceOf(this.acc).then(res => {
            this.balance = res;
          });
          this.getUnusedCapa1();
          this.getUnusedCapa2();
        });
      });
    });
  }

  setMyStorageOnline(nbr: number, account: any): any{
    this.contractService.setMyStorageOnline(nbr, this.acc)
  }

  setMyStorageOffline(nbr: number, account: any): any{
    this.contractService.setMyStorageOffline(nbr, this.acc);
  }

  getCapaOfMyStorage(nbr: any): any{
    return this.contractService.getCapaOfMyStorage(nbr, this.acc);
  }

  getUnusedCapa1(): any{
    this.contractService.getCapaOfMyStorage(0, this.acc).then(res => {
      this.used1 = (this.capa1 - res.toString());
      console.log(this.used1);
    /*  this.contractService.getOn().then(res => {
        if(res)
          this.used1 = this.capa1;
      });*/
      setTimeout(this.getUnusedCapa1(), 100);
    });
  }

  getUnusedCapa2(): any{
    this.contractService.getMyUnusedCapaInNextInterval(1, this.acc).then(res => {
      this.usage2 = res;
    });
  }

  updateUsage(): any {
    this.contractService.getUnusedCapaInNextInterval(1,1, this.acc).then(res => {
      this.usage1 = (this.capa1 - res.toString());
      setTimeout(this.updateUsage(), 100);
    });
  }


  changeCapa1(): any{
    this.contractService.changeCapa(0, this.currentValue1, this.acc);
    this.getCapaOfMyStorage(0).then(res =>{
      console.log(res);
      this.capa1 = res;
    });
  }

  changeCapa2(): any{
    this.contractService.changeCapa(1, this.currentValue2, this.acc);
    this.getCapaOfMyStorage(1).then(res =>{
      this.capa2 = res;
    });
  }

  claim(): any{
    this.contractService.claim(this.acc).then(res => {
      this.contractService.balanceOf(this.acc).then(res => {
        this.balance = res;
      });
    });
  }




}
