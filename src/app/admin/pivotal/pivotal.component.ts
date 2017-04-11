import {Component, OnInit} from "@angular/core";
import * as fileSaver from "file-saver";
import {WorkInfo} from "../../model/work-info";
import {SelectItem} from "primeng/primeng";
import {DownloadService} from "../service/download.service";
import {TimeService} from "../../service/time.service";
import {AgreementService} from "../service/agreement.service";
import {Agreement} from "../../model/agreement";
import {ReportService} from "../service/report.service";

@Component({
  selector: 'pivotal',
  templateUrl: './pivotal.component.html'
})
export class PivotalComponent implements OnInit {

  constructor(private downloadService: DownloadService, private reportService: ReportService, private agreementService: AgreementService, private timeService: TimeService) {
    this.types = [];
    this.types.push({label: 'PDF', value: 'pdf'});
    this.types.push({label: 'Excel', value: 'xlsx'});
  }

  ngOnInit(): void {
    this.departmentsUi.push({label: "בחר צוות", value: null});
    this.employeesUi.push({label: "בחר עובד", value: null});
    this.projectUi.push({label: "בחר פרויקט", value: null});
    this.clientUi.push({label: "בחר לקוח", value: null});
    this.getAgreements();
  }

  private selectedType: string = 'xlsx';
  private chosenEmployee;
  private chosenDepartment;
  private chosenProject;
  private chosenClient;
  private infos: WorkInfo[];
  private infosUi: WorkInfo[];
  private types: SelectItem[];
  private error: string;
  private tableVisible: boolean;
  private agreements: Agreement[];
  private employeesUi: SelectItem[] = [];
  private departmentsUi: SelectItem[] = [];
  private projectUi: SelectItem[] = [];
  private clientUi: SelectItem[] = [];

  getAgreements() {
    this.agreementService.getAgreements().subscribe(agreements => {
      this.agreements = agreements;
      this.getEmployeesUi();
      this.getDepartmentsUi();
      this.getProjectsUi();
      this.getClientsUi();
    }, error => {
      this.error = error;
    });
  }

  getEmployeesUi() {
    let arr = [];
    this.agreements.forEach(agreement => {
      if (arr.indexOf(agreement.employeeId) == -1) {
        this.employeesUi.push({
          label: agreement.employeeSurname + ' ' + agreement.employeeName,
          value: agreement.employeeId
        });
        arr.push(agreement.employeeId);
      }
    });
  }

  getDepartmentsUi() {
    let arr = [];
    this.agreements.forEach(agreement => {
      if (arr.indexOf(agreement.departmentId) == -1) {
        this.departmentsUi.push({
          label: agreement.departmentName,
          value: agreement.departmentId
        });
        arr.push(agreement.departmentId);
      }
    });
  }

  getProjectsUi() {
    let arr = [];
    this.agreements.forEach(agreement => {
      if (arr.indexOf(agreement.projectId) == -1) {
        this.projectUi.push({
          label: agreement.projectName,
          value: agreement.projectId
        });
        arr.push(agreement.projectId);
      }
    });
  }

  getClientsUi() {
    let arr = [];
    this.agreements.forEach(agreement => {
      if (arr.indexOf(agreement.clientId) == -1) {
        this.clientUi.push({
          label: agreement.clientName,
          value: agreement.clientId
        });
        arr.push(agreement.clientId);
      }
    });
  }

  getAllWorkInfo() {
    let from = this.timeService.getDateString(this.timeService.fromDate);
    let to = this.timeService.getDateString(this.timeService.toDate);
    let employeeId = this.chosenEmployee != null ? this.chosenEmployee.toString() : null;
    let departmentId = this.chosenDepartment != null ? this.chosenDepartment.toString() : null;
    let projectId = this.chosenProject != null ? this.chosenProject.toString() : null;
    let clientId = this.chosenClient != null ? this.chosenClient.toString() : null;
    this.reportService.getPivotalForPeriod(from, to, employeeId, departmentId, projectId, clientId)
      .subscribe(infos => {
        this.infosUi = infos;
        this.tableVisible = true;
      }, err => {
        this.error = err;
      });
  }

  pivotalReport() {
    let from = this.timeService.getDateString(this.timeService.fromDate);
    let to = this.timeService.getDateString(this.timeService.toDate);
    let employeeId = this.chosenEmployee != null ? this.chosenEmployee.toString() : null;
    let departmentId = this.chosenDepartment != null ? this.chosenDepartment.toString() : null;
    let projectId = this.chosenProject != null ? this.chosenProject.toString() : null;
    let clientId = this.chosenClient != null ? this.chosenClient.toString() : null;
    this.downloadService.downloadPivotal(this.selectedType, from, to, employeeId, departmentId, projectId, clientId)
      .subscribe(res => {
          let appType = this.downloadService.getMimeType(this.selectedType);
          let blob = new Blob([res.blob()], {type: appType});
          fileSaver.saveAs(blob, 'pivotal.' + this.selectedType);
        },
        err => {
          this.error = err;
        });
  }
}
