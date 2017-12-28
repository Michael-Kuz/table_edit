//'use strict'
//import {createElement} from './helpers.js';

class ViewTable extends EventEmitter{
	constructor( obj ){
		super();
		 
		this.form = document.querySelector('.admin-form-orders'); //берем обьект DOM формы
		this.btnRemove = this.form.querySelector('.admin-form-orders_btn-remove'); //кнопка "Удалить заказ"
		this.btnAdd = this.form.querySelector('.admin-form-orders_btn-add'); //кнопка "Добавить заказ"
		this.btnSave = this.form.querySelector('.admin-form-orders_btn-save'); //кнопка "Сохранить заказ"
		this.table = document.querySelector('.adminTable'); //берем обьект DOM таблицы
		this.checkboxInputs = this.table.querySelectorAll('[type="checkbox"]'); //берем все input[type='checkbox'], которые уже есть в таблице
		Array.prototype.forEach.call( this.checkboxInputs, (input)=>{input.addEventListener('change', this.handlToggle.bind(this) )} );
		this.buttonsAddEventListeners();
		//this.toggleItem({checked: false, id: 2})
		//this.editItem({ id: 1, name: 'Mike', price: 5000 });
		//this.removeItem(3);
		//this.addItem({checked: true, id: 3, name: 'Mike'});
		 
	}
	
	/*-----------------------------------------------------------------------------*/
	/* Этот метод вешает дополнительные обработчики событий которые происходят вне */
	/* таблицы, поэтому эта функция запускается в конструкторе                     */
	buttonsAddEventListeners(){
		addEventListener('keydown', this.handlKeyDown.bind(this) ); //обработчик для клавиш клавиатуры
		this.btnRemove.addEventListener('click', this.handlRemove.bind(this) );
		this.btnAdd.addEventListener('click', this.handlAdd.bind(this) );
		this.btnSave.addEventListener('click', this.handlSave.bind(this) );
		
	}
	/*----------------------------------------------------------------------------*/
	/* Этот метод обрабатывает событие по нажатию кнопок                          */
	handlKeyDown(event){
		const ESC = 27;
		if( event.keyCode == ESC ){
			this.emit('ESC', null);
		}
	}
	/*----------------------------------------------------------------------------*/
	/* Этот метод обрабатывает событие по "Удалить заказ"                         */
	handlRemove(event){
		event.preventDefault();
		this.emit('remove', null);
	}
	/*----------------------------------------------------------------------------*/
	/* Этот метод обрабатывает событие по "Добавить заказ"                        */
	handlAdd(event){
		event.preventDefault();
		this.emit('add', null);
	}
	/*----------------------------------------------------------------------------*/
	/* Этот метод обрабатывает событие по "Сохранить заказ"                       */
	handlSave(event){
		event.preventDefault();
		this.emit('save', null);
	}
	
	/*----------------------------------------------------------------------------*/
	/* Это вспомогательный метод создает элемент html                             */
	createElement(tag, props, ...children ){
		const element = document.createElement(tag);
	
		Object.keys(props).forEach( key => element[key] = props[key] );
		
		if( children.length > 0 ){
			children.forEach( child => {
				if( typeof child === 'string' ){
					child = document.createTextNode(child);
				}
				element.appendChild(child);
			});
		}
		return element;
	}
	
	/*-----------------------------------------------------------------------------*/
	/* Этот метод создает овый элемент для вставки в представление                 */
	createItem(todo){
		const checkbox = this.createElement('input', {type: 'checkbox', name: 'checkbox', checked: todo.checkbox} );
		const cellCheckbox = this.createElement('div', {className: 'adminTable_cell adminTable_cell-checkbox'}, checkbox );
		
		const id = this.createElement('input', {type: 'number', name: 'id', value: todo.id, disabled: todo.checkbox ? true : true } );
		const cellId = this.createElement('div', {className: 'adminTable_cell adminTable_cell-id'}, id );
		
		const name = this.createElement('input',{type: 'text', name: 'name', value: todo.name, pattern: '^[0-9a-zA-Zа-яА-ЯёЁ_ ]+$', title: 'Допустимы буквы и цифры', maxlength: 100,  disabled: todo.checked ? false : true,   required: true } );
		const cellName = this.createElement('div', {className: 'adminTable_cell adminTable_cell-name'}, name );
		
		const price = this.createElement('input',{type: 'number', name: 'price', value: todo.price, title: 'Десять цифр без пробелов', disabled: todo.checked ? false : true } );
		const cellPrice = this.createElement('div', {className: 'adminTable_cell adminTable_cell-price'}, price );
		
		const phone = this.createElement('input', {type: 'tel', name: 'phone', value: todo.phone, title: 'Десять цифр без пробелов', pattern: '[0-9]{10}', disabled: todo.checked ? false : true,  required: true});
		const cellPhone = this.createElement('div', {className: 'adminTable_cell adminTable_cell-phone'}, phone );
		
		const email = this.createElement('input', {type: 'email', name: 'email', pattern: '^[a-z0-9_][a-z0-9\._-]*@([a-z0-9]+([a-z0-9-]*[a-z0-9]+)*\.)+[a-z]+$', value: todo.email, disabled: todo.checked ? false : true});
		const cellEmail = this.createElement('div', {className: 'adminTable_cell adminTable_cell-email'}, email );
		
		const dateOrder = this.createElement('input', {type: 'date', name: 'date_order',  value: todo.date_order, title: 'Введите дату в формате дд.мм.гггг время в формате чч:мм:сс', pattern: '\d{2}\.\d{2}\.\d{4}(\s\d{2}:\d{2}:\d{2}){0,1}', disabled: todo.checkbox ? false : true, required: true});
		const cellDateOrder = this.createElement('div', {className: 'adminTable_cell adminTable_cell-date'}, dateOrder );
		
		const dateConfirm = this.createElement('input', {type: 'date', name: 'date_confirm',  value: todo.date_confirm, disabled: todo.checkbox ? false : true});
		const cellDateConfirm = this.createElement('div', {className: 'adminTable_cell adminTable_cell-date'}, dateConfirm );
		
		const datePay = this.createElement('input', {type: 'date', name: 'date_pay',  value: todo.date_pay, disabled: todo.checkbox ? false : true})
		const cellDatePay = this.createElement('div', {className: 'adminTable_cell adminTable_cell-date'}, datePay );
		
		const dateCancel = this.createElement('input', {type: 'date', name: 'date_cancel', value: todo.date_cancel, disabled: todo.checkbox ? false : true})
		const cellDateCancel = this.createElement('div', {className: 'adminTable_cell adminTable_cell-date'}, dateCancel );
		
		
		const item = this.createElement('div', {className: 'adminTable_row'}, cellCheckbox, cellId, cellName, cellPrice, cellPhone, cellEmail, cellDateOrder, cellDateConfirm, cellDatePay, cellDateCancel );
		
		return this.addEventListeners(item); //вешаем обработчики событий на элементы item если таковые нужны
	}
	
	/*------------------------------------------------------------------------------*/
	/* Этод метод вешает неоюходимые обработчики событий на вновь зозданный элемент */
	addEventListeners(item){
		const checkbox = item.querySelector( '[type="checkbox"]' );
		checkbox.addEventListener( 'change', this.handlToggle.bind(this) );
		return item;
	}
	/*------------------------------------------------------------------------------*/
	/* этот метод обрабатывает событие 'change' на checkbox-сах                     */
	handlToggle(event){
		this.emit('toggle', event);
	}
	
	/*-----------------------------------------------------------------------------*/
	/* Этод метод добавляет новую строку в таблицу(в верхнюю ее часть)             */
	/* в качестве аргумента передвется обьект todo содержащий свойства для вставки */
	/* в таблицу                                                                   */
	addItem(todo, before=true){
		const item = this.createItem(todo);
		if( before )
			this.table.insertBefore( item, this.table.children[1] );
		else
			this.table.appendChild(item);
	}
	
	/*-----------------------------------------------------------------------------*/
	/* это вспомогательный метод котрый находит уже существующий в DOM item по     */
	/* по значению свойства id полученного из массива состояния state[] модели     */      
	findListItem( id ){
		const inputId = this.table.querySelectorAll('input[name="id"]');
		for( let i=0; i< inputId.length; i++){
			if( inputId[i].value == id ){
				return inputId[i].parentNode.parentNode;
			}
		}
	}
	
	/*-----------------------------------------------------------------------------*/
	/* Этод метод меняет отображение listItem в DOM структуре в зависимости        */
	/* от состаяния свойства checkbox в моделе                                     */
	/* в качестве аргумента передвется обьект todo содержащий свойства модели      */
	toggleItem(todo){
		const listItem = this.findListItem( todo.id );
		const checkbox = listItem.querySelector("[type='checkbox']");
		const inputs = listItem.querySelectorAll('input');
				
		if( checkbox.checked == true){
			Array.prototype.forEach.call( inputs, (input) => { 
				input.type != 'checkbox' && input.name != 'id' ? input.removeAttribute('disabled'):'';
			});
		}else if( checkbox.checked == false ){
			Array.prototype.forEach.call( inputs, (input)=>{ 
				input.type == 'checkbox' ? '' : input.setAttribute("disabled", "disabled")
			});
		}
	}
	/*-------------------------------------------------------------------------------*/
	/* Этот метод корректирует представление модели  в зависимости от состояния      */
	/* модели                                                                        */
	updateItem( todo ){
		const listItem = this.findListItem( todo.id );
		const inputs = listItem.querySelectorAll('input');
		Array.prototype.forEach.call(inputs, input => {
			if( input.name == 'checkbox' ){
				input.checked = todo[input.name];
			}else{
				input.value = todo[input.name]; //устанавливаем значение поля input
			}
			if( todo.checkbox == true && input.name != 'id' ){
				 input.removeAttribute('disabled');
			}else if( !todo.checkbox  && input.type != 'checkbox' ){
				input.setAttribute("disabled", "disabled");
			}
		});	
	}
	/*-------------------------------------------------------------------------------*/
	/* Этот метод удаляет элемени из списка представления                            */
	removeItem(id){
		const listItem = this.findListItem( id );
		this.table.removeChild(listItem);
	}
}
//export default View;