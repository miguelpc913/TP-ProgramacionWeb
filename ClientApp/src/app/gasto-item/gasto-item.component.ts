import { Component, OnInit, Input, Output , EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Gasto } from '../models/gasto';
import { GastosService } from '../services/gastos.service';

@Component({
  selector: 'app-gasto-item',
  templateUrl: './gasto-item.component.html',
  styleUrls: ['./gasto-item.component.css']
})
export class GastoItemComponent implements OnInit {
  @Input () gasto : Gasto;
  @Output () borrarGasto : EventEmitter<number> = new EventEmitter();
  @Output () editarGasto = new EventEmitter();

  enableEdit : boolean = false;

  
  constructor() { }

  ngOnInit() {
  
  }

  Borrar(gastoId: number){
    this.borrarGasto.emit(gastoId)
  }
  
  EditarGasto(){
    this.editarGasto.emit()
  }

  EnableEdit(){
    this.enableEdit = !this.enableEdit;
  }

}
