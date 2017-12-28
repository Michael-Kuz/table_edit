class EventEmitter{
	constructor(){
		this.events = {};
	}
	
	on( type, listener ){
		this.events[type] = this.events[type] || [];
		this.events[type].push(listener);
	}
	
	emit( type, arg ) {
        if (this.events[type]) {
            this.events[type].forEach(listener => listener(arg));
        }
    }
}
function creatElement(tag, props, ...children){
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

//export default helpers;