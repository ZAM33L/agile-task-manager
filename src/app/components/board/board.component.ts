import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { Column } from '../../models/column.model';
import { ColumnComponent } from '../column/column.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, ColumnComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {

  // =============================
  // DYNAMIC COLUMNS
  // =============================

  columns: Column[] = [
    { id: 'todo', title: 'To Do', color: 'red', tasks: [] },
    { id: 'progress', title: 'In Progress', color: 'yellow', tasks: [] },
    { id: 'completed', title: 'Completed', color: 'green', tasks: [] },
    { id: 'delivered', title: 'Delivered', color: 'blue', tasks: [] }
  ];

  currentColumnId: string = '';

  // =============================
  // ADD MODAL
  // =============================

  showAddModal = false;

  newTask: Task = {
    id: 0,
    title: '',
    description: '',
    priority: 'Medium'
  };

  openAddModal(columnId: string) {
    this.currentColumnId = columnId;
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  addTask() {
    const column = this.columns.find(c => c.id === this.currentColumnId);
    if (!column) return;

    column.tasks.push({
      ...this.newTask,
      id: Date.now()
    });

    this.newTask = {
      id: 0,
      title: '',
      description: '',
      priority: 'Medium'
    };

    this.closeAddModal();
  }

  // =============================
  // EDIT TASK
  // =============================

  showEditModal = false;
  editingTask: Task | null = null;

  openEditModal(task: Task) {
    this.editingTask = { ...task };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingTask = null;
  }

  updateTask() {
    if (!this.editingTask) return;

    const column = this.columns.find(col =>
      col.tasks.some(t => t.id === this.editingTask!.id)
    );

    if (!column) return;

    const index = column.tasks.findIndex(
      t => t.id === this.editingTask!.id
    );

    if (index !== -1) {
      column.tasks[index] = { ...this.editingTask };
    }

    this.closeEditModal();
  }

  // =============================
  // DELETE SINGLE TASK (COLUMN AWARE)
  // =============================

  showTaskDeleteConfirm = false;
  taskToDelete: { columnId: string; taskId: number } | null = null;

  openTaskDeleteConfirm(data: { columnId: string; taskId: number }) {
    this.taskToDelete = data;
    this.showTaskDeleteConfirm = true;
  }

  closeTaskDeleteConfirm() {
    this.showTaskDeleteConfirm = false;
    this.taskToDelete = null;
  }

  confirmTaskDelete() {
    if (!this.taskToDelete) return;

    const column = this.columns.find(
      c => c.id === this.taskToDelete!.columnId
    );

    if (column) {
      column.tasks = column.tasks.filter(
        task => task.id !== this.taskToDelete!.taskId
      );
    }

    this.closeTaskDeleteConfirm();
  }

  // =============================
  // DELETE ALL IN COLUMN
  // =============================

  showDeleteConfirm = false;
  deleteColumnId: string = '';

  openDeleteConfirm(columnId: string) {
    this.deleteColumnId = columnId;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
  }

  confirmDelete() {
    const column = this.columns.find(c => c.id === this.deleteColumnId);
    if (column) {
      column.tasks = [];
    }

    this.closeDeleteConfirm();
  }
  get connectedColumnIds(): string[] {
  return this.columns.map(c => c.id);
}

}
