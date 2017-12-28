class Controller{
	constructor( model, view ){
		this.model = model;
		this.view = view;
		this.show();
		this.iniDemo();
		this.iniDemo();
		/*-------------------------------------------------------------------------------------*/				
		/*   "toggle" - переключения checkbox строки для ее активации или деактивации */
		/*   "ESC" - отмена режима редактирования строки или строк                             */
		/*   "add" - добавление новой строки                                                   */
		/*   "update" - сохранение изменений в строке или строках                              */
		/*   "delete" - удалить строку или несколько строк                                      */
		this.view.on("toggle", this.toggleTodo.bind(this) ); //подписываемся на события 
		this.view.on("add", this.addTodo.bind(this) ); 
		this.view.on("remove", this.removeTodo.bind(this) ); 
		this.view.on("save", this.saveTodo.bind(this) ); 
		this.view.on("ESC", this.escFunction.bind(this) ); 
	}
	
	/*  Этот метод выводит представление модели при загрузке приложения  */
	show(){
		if( localStorage.length ){
			for( let i=0; i<localStorage.length; i++ ){
				let key = localStorage.key(i);
				let item = this.model.load( key );
				this.view.addItem(item);
				if( item.checkbox ){
					this.model.state.push(item);
				}
				this.view.updateItem(item);
					
			}
		}
	}
	/*--- этот метод инициализирут несколько строк для демострационного варианта ---*/
	iniDemo(){
		let todo={checkbox: false, id:Date.now(), name:'', price:'', phone:'', email:'', date_order:'', date_cofirm:'', date_pay:'', date_cancel:''};
		todo.id = todo.id.toString().substr(-7);
		this.view.addItem(todo);
	}
	
	/*----------------------------------------------------------------------------*/
	/* Этот метод создает item для вставки в модел в массив состояний             */
	createTodo(listItem){
		const inputs = listItem.querySelectorAll('input:not([type="checkbox"])');//получаем все кроме checkbox
		const todo={};
		todo.checkbox = '';
		Array.prototype.forEach.call(inputs, input=>{todo[input.name] = input.value});
		return todo;
	}
	
	/*----------------------------------------------------------------------------*/
	/* этод метод переключает checkbox строки активируя или деактивируя строку    */
    /* для редактирования	                                                      */
	toggleTodo( event ){
		const listItem = event.target.parentNode.parentNode;
		let todo = this.model.getItem( listItem.querySelector('[name="id"]').value );
		if( !todo ){
			todo = this.createTodo(listItem);
			todo.checkbox = event.target.checked;
			this.model.addItem(todo); //добавляем в модель
			this.model.update(todo); //проверяем есть ли в хранилище, если есть - корректируем 
			this.view.updateItem(todo); //отображаем в представлении	
		}else if( todo ){
			//****проверка и запрос на сохранение в базу данных?
			let save = confirm("Сохранить строку?");
			if( save ){
				todo = this.createTodo(listItem);//обновляем состояние
				todo.checkbox = event.target.checked;
				this.model.updateItem(todo.id, todo);//обновляем item в модели
				this.model.save( todo );//сохраняем модел в хранилище
				this.view.updateItem(todo); //отображаем во view
				this.model.removeItem(todo.id);//удаляем модель из массива состояния
			}else{
				todo.checkbox = event.target.checked; //корректируем ckeckbox в модели
				this.model.update(todo); //проверяем есть ли в хранилище, если есть - корректируем 
				this.view.updateItem(todo); //отображаем в представлении
				this.model.removeItem(todo.id); //удаляем модель	 
		    }
		} 
	}
	
	/*----------------------------------------------------------------------------*/
	/* этод метод отменяет редактирование строки(строк) и убирает отметку в       */
	/* checkbox                                                                   */
	escFunction(){
		this.model.state.forEach( item=>{
			
			item.checkbox = false;
			this.model.update(item);
			this.view.updateItem(item );
		});
		this.model.state = [];
	}
	
	/*----------------------------------------------------------------------------*/
	/* этод метод добавляетновую (шаблонную) строку в модель                      */
	addTodo(){
		const template = { checkbox: true, id: Date.now(), name:'', price:'', phone:'', email:'', date_order:'', date_cofirm:'', date_pay:'', date_cancel:'', completed: false };
		template.id = template.id.toString().substr(-7);
		this.model.addItem(template);
		if( this.view.table.children.length > 1 ){
			this.view.addItem(template);
		}else if( this.view.table.children.length == 1 ){
			this.view.addItem(template, false);
		}
		this.view.updateItem(template);
	}
	
	/*----------------------------------------------------------------------------*/
	/* этод метод удаляет выделенную строку(строки)                               */
	removeTodo(){
		if( !this.model.state.length ){
			alert('В таблице нет омеченных для удаления строк.');
			return;
		}
		let flag = confirm('Удалить отмеченные строки?');
		if( flag ){
			this.model.state.forEach( item=>this.model.remove(item) );
			this.model.state.forEach( item=>this.view.removeItem(item.id) );
			this.model.state = [];
		}
	}
	
	/*----------------------------------------------------------------------------*/
	/* этод метод сохраняет выделенную строку(строки)                               */
	saveTodo(){
		if( !this.model.state.length ){
			alert('В таблице нет омеченных для сохранения строк.');
			return;
		}
		let flag = confirm('Сохранить отмеченные строки?');
		if( flag ){
			let listItem;
			let data;
			let removeList = [];
			this.model.state.forEach( (item, i)=>{
				listItem = this.view.findListItem( item.id );
				data = this.createTodo(listItem);//предварительно создадим новый item для обновления
				data.checkbox = false; //сбрасываем checkbox
				this.model.updateItem( item.id, data );
				this.view.updateItem(item);
				this.model.save(item);
				removeList.push(item.id);
			});
			removeList.forEach( id=>this.model.removeItem(id) );
		}
	}
}
//export default Controller;