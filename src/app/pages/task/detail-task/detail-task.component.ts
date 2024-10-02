import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-project-task-details',
  templateUrl: './detail-task.component.html',
  styleUrls: ['./detail-task.component.scss'],
})
export class ProjectTaskDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<ProjectTaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
