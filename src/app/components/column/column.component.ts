import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { TaskComponent } from '../task/task.component';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, TaskComponent, DragDropModule],
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent {

  @Input() title!: string;
  @Input() tasks: Task[] = [];
  @Input() color!: string;

  @Input() showAddButton = false;
  @Input() showDeleteAll = false;

  @Input() columnId!: string;
  @Input() connectedTo: string[] = [];

  /* 🔥 Controlled by Parent */
  @Input() isMenuOpen = false;
  @Output() menuToggle = new EventEmitter<string>();

  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<{ taskId: number; columnId: string }>();
  @Output() addTask = new EventEmitter<void>();
  @Output() deleteAll = new EventEmitter<void>();
  @Output() taskMoved = new EventEmitter<void>();

  /* ========================= */
  /* MENU */
  /* ========================= */

  toggleMenu(event: MouseEvent) {
  event.stopPropagation();
  this.menuToggle.emit();
}


  /* ========================= */
  /* TASK ACTIONS */
  /* ========================= */

  onEdit(task: Task) {
    this.edit.emit(task);
  }

  onDelete(taskId: number) {
    this.delete.emit({
      columnId: this.columnId,
      taskId: taskId
    });
  }

  onAddTask() {
    this.addTask.emit();
  }

  onDeleteAll() {
    this.deleteAll.emit();
  }

  /* ========================= */
  /* DRAG DROP */
  /* ========================= */

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.taskMoved.emit();
  }
}
