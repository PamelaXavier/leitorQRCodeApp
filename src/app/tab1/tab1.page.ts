import { Component, ChangeDetectorRef } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { HistoricoService } from '../servicos/historico.service';
import { Historico } from '../models/Historico';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public leitorQRCode: any;
  //variavel que possibilita ver a camera na aplicacao
  public content: HTMLElement;
  public imgLogo: HTMLElement;
  public footer: HTMLElement;

  public leitura: string;
  public link = false;

  constructor(
    private qrScanner: QRScanner,
    public alertController: AlertController,
    public platform: Platform,
    private screenOrientation: ScreenOrientation,
    private cdRef: ChangeDetectorRef,
    private historicoService: HistoricoService,

  ) {

    // Trava a tela para impedir a rotacao do app no cel
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.platform.backButton.subscribeWithPriority(0, () => {
      this.content.style.opacity = "1";
      this.imgLogo.style.opacity = "1";
      this.footer.style.opacity = "1";

      this.leitura = null;
      this.link = false;

      this.qrScanner.hide();
      this.leitorQRCode.unsubscribe();

    });
  }

  public async lerQRCode() {
    // Chama a variavel e começa a fazer a leitura
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // Faz a pergunta de autorizacao para utilizar a camera, se for autorizado começa a leitura

          this.content = document.getElementsByTagName('ion-content')[0] as HTMLElement;
          this.imgLogo = document.getElementById('logo') as HTMLElement;
          this.footer = document.getElementById('footer') as HTMLElement;

          this.content.style.opacity = "0"; // essa propriedade precisa estar como uma string, entre aspas
          this.imgLogo.style.opacity = "0";
          this.footer.style.opacity = "0";

          this.qrScanner.show(); // faz com que a camera apareca

          // comeca a fazer a leitura
          this.leitorQRCode = this.qrScanner.scan().subscribe(async (text: string) => {

            this.leitura = (text['result']) ? text['result'] : text;

            this.content.style.opacity = "1"; //devolve a opacidade da tea
            this.imgLogo.style.opacity = "1";
            this.footer.style.opacity = "1";

            this.qrScanner.hide(); //Encerra a aparicao da camera
            this.leitorQRCode.unsubscribe(); // terminar de escanear

            //this.presentAlert('LEITURA: ', this.leitura);

            this.verificaLink(this.leitura);
            this.cdRef.detectChanges();

            const historico = new Historico();
            historico.leitura = this.leitura;
            historico.dataHora = new Date();

            await this.historicoService.create(historico).then(resposta => {
              console.log(resposta);
            }).catch(erro => {
              this.presentAlert('ERRO!', 'Erro ao salvar no Firabase.');
              console.log('ERRO: ', erro);
            });
          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  async presentAlert(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }

  public verificaLink(texto: string) {
    const inicio = texto.substring(0, 4);

    if (inicio == 'www.' || inicio == "http") {
      this.link = true;
    } else {
      this.link = false;
    }

  }

}
