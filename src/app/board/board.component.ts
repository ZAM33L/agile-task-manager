import { Component } from "@angular/core";
import { Task } from "../models/task.model";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-board',
    standalone:true,
    imports:[CommonModule,FormsModule],
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css']
})

export class BoardComponent {
    todoTasks: Task[] = [];

    newTask: Task = {
        id: 0,
        title: '',
        description: '',
        priority: 'Medium'
    };

    addTask() {

        this.todoTasks.push({
            ...this.newTask,
            id: Date.now()
        });

        this.newTask = {
            id: 0,
            title: '',
            description: '',
            priority: 'Medium'
        }
    };
}