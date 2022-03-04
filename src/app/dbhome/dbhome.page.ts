import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Student } from './notebooks';
import { StudentService } from './StudentService';
import { AngularFirestore } from '@angular/fire/compat/firestore';

var demodemo = 100

@Component({
  selector: 'app-home',
  templateUrl: 'dbhome.page.html',
  styleUrls: ['dbhome.page.scss'],
})

export class DbhomePage implements OnInit {
  stdobj: any;
  searchTerm: string;
  constructor(private apiservice: StudentService, private alertCtrl: AlertController,
    private router: Router, private ngFirestore: AngularFirestore) { }

  ngOnInit() {
    this.apiservice.getData().subscribe((res) => {

      this.stdobj = res.map((t) => (
        {  
          id: t.payload.doc.id,
          db_name: t.payload.doc.data()['db_name'.toString()],
          db_price: t.payload.doc.data()['db_price'],
          db_details: t.payload.doc.data()['db_details'.toString()],
          
          db_date: new Date(t.payload.doc.data()['db_date']).getDate()
          + "/" + (new Date(t.payload.doc.data()['db_date']).getMonth()+1)
          + "/" + (new Date(t.payload.doc.data()['db_date']).getFullYear()+543)
          + " " + (new Date(t.payload.doc.data()['db_date']).getHours())
          + ":" + (new Date(t.payload.doc.data()['db_date']).getMinutes())
          + ":" + (new Date(t.payload.doc.data()['db_date']).getSeconds())
        }

        ));
        console.log(this.stdobj);
      });

    }//method

    async presentPromptAdd() {
      const alert = this.alertCtrl.create({
        subHeader: 'Add',
        inputs: [
          {
            name: 'mdb_name',
            placeholder: 'ชื่อ'
          },

          {
            name: 'mdb_price',
            placeholder: 'ราคา/บาท'
          },
          
          {
            name: 'mdb_details',
            placeholder: 'รายละเอียด'
          }

        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Add',
            handler: data => {
              const tmpdata = {};
               tmpdata['db_name'.toString()] = data.mdb_name;
               tmpdata['db_price'] = parseInt(data.mdb_price);
               tmpdata['db_details'.toString()] = data.mdb_details;

               tmpdata['db_date'] = Date.now();
                  this.apiservice.createUser(tmpdata);
                  console.log(tmpdata);
            }
          }
        ]
      });
      (await alert).present();
    }

    async presentConfirmDelete(delid: any) {
      const alert = this.alertCtrl.create({
        subHeader: 'Delete', // Header
        message: 'ยินยันการลบหรือไม่?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Delete',
            handler: () => {
              //console.log('Buy clicked');

              this.apiservice.deleteUser(delid);
            }
          }
        ]
      });
      (await alert).present();
    }

// Update
    //async presentPromptEdit(id, name, age, address) {
      async presentPromptEdit(tmpobj) {
      const alert = this.alertCtrl.create({
        subHeader: 'Edit',
        message: 'แก้ไขสมุดบันทึก'+name,
        inputs: [
          {
            name: 'mdb_name',
            placeholder: tmpobj.db_name,
            value: tmpobj.db_name
          },
          {
            name: 'mdb_price',
            placeholder: tmpobj.db_price,
            value: tmpobj.db_price
          },
          {
            name: 'mdb_details',
            placeholder:tmpobj.db_details,
            value: tmpobj.db_details
          }
        ],
        buttons: [
          {
            text: 'ยกเลิก',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'ยืนยันอัพเดต',
            handler: data => {
              const updatedata = {};
               updatedata['db_name'.toString()] = data.mdb_name;
               updatedata['db_price'] = parseInt(data.mdb_price);
               updatedata['db_details'.toString()] = data.mdb_details;

               updatedata['db_date'] = Date.now();
               ///this.ngFirestore.doc('/Student/'+id).update(updatedata);
               this.apiservice.updateUser(tmpobj.id, updatedata);
               console.log(updatedata);
            }
          }
        ]
      });
      (await alert).present();
    }


}//class
