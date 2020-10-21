import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Historico } from '../models/Historico';



@Injectable({
  providedIn: 'root'
})
export class HistoricoService {

  constructor( private afs: AngularFirestore) { }

  //Create
  public create(historico: Historico){
    return this.afs.collection('historicos').add({...historico});
  }

  // get
  public getAll(){
   return this.afs.collection('historicos').snapshotChanges();
  }

  //update

  public update(key:string, historico: Historico){
    return this.afs.doc(`historicos/${key}`).update(historico);
  }

  //delete
  public delete(key:string){
    return this.afs.doc(`historicos/${key}`).delete();
  }
}
