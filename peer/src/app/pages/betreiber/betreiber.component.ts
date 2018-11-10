import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../services/web3.service';
import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-betreiber',
  templateUrl: './betreiber.component.html',
  styleUrls: ['./betreiber.component.css']
})
export class BetreiberComponent implements OnInit {

  constructor(
    private web3Service: Web3Service,
    private contractService: ContractService,
  ) { }

  color = 'primary';
  mode = 'determinate';
  value = 50;
  bufferValue = 100;

  maxCapa: number;

  acc: any;

  capa1: any;
  currentValue1 = 10;

  capa2: any;
  currentValue2 = 10;

  usage1: any;
  usage2: any;

  balance: any;

  kapaAnforderung= 100;

  ngOnInit() {
    this.web3Service.getAccounts().subscribe(accs => {
      this.acc = accs[0];
      this.contractService.start().then((res) =>{
        this.getMaxCapa();
        });
    });
  }

  getMaxCapa(): any{
    this.contractService.getMaxCapa().then(res => {
      console.log(res);
      this.maxCapa = res;

      this.value = (this.kapaAnforderung/this.maxCapa)*100;

      setTimeout(this.getMaxCapa(), 100);
    });
  }

  useCapa(x: any, y: any){
    this.contractService.useCapaInNextIntervalForXY(x, y, this.kapaAnforderung, this.acc).then(res => {
      this.value += res.toString();
    });
  }

}
