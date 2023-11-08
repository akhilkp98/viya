import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '';
  dataForm: FormGroup;

  datasource: any = [];
  visible: boolean | undefined;
  saveEnable: boolean | undefined;
  editDta: boolean | undefined;
  editingData: any;

  constructor(private messageService: MessageService) {
    this.dataForm = new FormGroup({
      name: new FormControl(),
      points: new FormControl()
    });
  }

  ngOnInit(): void {
  }


  add() {
    this.visible = true;
    this.editDta = false;
  }

  editData() {
    const index = this.datasource.findIndex((item: any) => item.id === this.editingData.id);
    this.datasource[index].name = this.dataForm.controls['name'].value;
    this.datasource[index].netPoint = this.dataForm.controls['points'].value;
    this.messageService.add({ severity: 'info', summary: 'Updated', detail: 'Updated Successfully', life: 2000 });
    this.visible = false;
    this.dataForm.reset();
    this.manipulateAddedDta(this.datasource);
  }

  save() {
    this.datasource.push({
      id: this.datasource.length == 0 ? 0 : this.datasource.length + 1,
      name: this.dataForm.controls['name'].value,
      netPoint: this.dataForm.controls['points'].value,
      rank: this.datasource.length + 1,
    })
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Added Successfully', life: 2000 });
    this.visible = false;
    this.dataForm.reset();
    this.manipulateAddedDta(this.datasource);
  }

  edit(data: any) {
    this.editingData = [];
    this.editingData = data;
    this.dataForm.controls['name'].setValue(data.name);
    this.dataForm.controls['points'].setValue(data.netPoint);
    this.visible = true;
    this.editDta = true;
  }

  deleteData(data?: any) {
    const index = this.datasource.findIndex((item: any) => item.id === data.id);
    if (index !== -1) {
      this.datasource.splice(index, 1);
    }

    this.messageService.add({ severity: 'info', summary: 'Deleted', detail: 'Deleted Successfully', life: 2000 });
    this.visible = false;
    this.manipulateAddedDta(this.datasource);

  }

  manipulateAddedDta(data: any) {
    data.sort((a: { netPoint: number; }, b: { netPoint: number; }) => b.netPoint - a.netPoint);

    // Initialize variables to keep track of position and previous netPoint
    let position = 1;
    let prevNetPoint = data[0].netPoint;

    data.forEach((item: { netPoint: any; rank: string | number; }, index: number) => {
      if (index > 0 && item.netPoint !== prevNetPoint) {
        position++;
      }

      if (index > 0 && item.netPoint === prevNetPoint) {
        item.rank = `T${position}`;
      } else {
        item.rank = position;
      }

      prevNetPoint = item.netPoint;
    });
  }

}
