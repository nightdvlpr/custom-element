import _ from 'lodash';
import axios from 'axios';
import Swal from 'sweetalert2'

/**
 * Generate a template tag
 */
function component() {
    const element = document.createElement('template');
    element.setAttribute("id", "validationTemplate");
    element.innerHTML = `
    <link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Redressed&display=swap" rel="stylesheet">
    <style>
    :host {
        display: block;
        width: 100%;
        max-width: 600px;
        font-family: 'Redressed', cursive;
        transition: opacity 0.3s ease-in-out;
    }

    input,
    button {
        display: block;
        padding: 8px 0;
        width: 100%;
        margin-top: 8px;
        background: #fff;
        border: 1px solid #e3e3e3;
    }
    </style>
    <slot></slot><!-- slotted content appears here -->
    <p id="msg" style="color:red;"></p>
    <input type="text" name="fullname" id="fullname" placeholder="Fullname">
    <input type="text" name="email" id="email" placeholder="Email Or Phone">
    <input type="text" name="code" id="code" placeholder="Code" value="">
    <button id="btnValidate">Validate</button>
    `;
    return element;
}

function myCustomElemnts() {
    class validation extends HTMLElement {
        constructor() {
            super();

            const shadowRoot = this.attachShadow({
                mode: 'open'
            });
            shadowRoot.appendChild(document.querySelector("#validationTemplate").content.cloneNode(true));

            this.txtFullname = this.shadowRoot.querySelector('#fullname');
            this.txtEmail = this.shadowRoot.querySelector('#email');
            this.txtCode = this.shadowRoot.querySelector('#code');
            this.buttonValidate = this.shadowRoot.querySelector('#btnValidate');
            this.msgHolder = this.shadowRoot.querySelector('#msg');
            this.run = this.run.bind(this);
        }

        get msg() {
            return this.msg;
        }

        set msg(val) {
            this.msg =val; 
            this.msgHolder.innerText = val;
        }

        run() {
            if (
            this.txtEmail.value==="" ||
            this.txtCode.value===""){
                Swal.fire({
                    title: 'Fill the fields',
                    text: 'Please compelete the fields',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  })
                  return false;
            }
            axios.get('https://nightdvlpr.com/v1/validation', {
                    params: {
                        fullname: this.txtFullname.value,
                        email: this.txtEmail.value,
                        code: this.txtCode.value
                    }
                })
                .then(function (response) {
                    console.log(response);

                    if (response['data']['result']) {
                    Swal.fire({
                        title: 'Validation',
                        text: response['data']['message'],
                        icon: 'success',
                        confirmButtonText: 'Cool'
                      })
                    }else {
                        Swal.fire({
                            title: 'Validation',
                            text: response['data']['message'],
                            icon: 'error',
                            confirmButtonText: 'Ok'
                          })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
        }

        connectedCallback() {
            this.buttonValidate.addEventListener('click', this.run);
        }

        disconnectedCallback() {
            this.buttonValidate.addEventListener('click', this.run);
        }
    }

    customElements.define('yanj-validation', validation);
    customElements.whenDefined('yanj-validation', validation).then(() => {
        console.log('yanj-validation defined');
    });
}


/**
 * When DOM is ready
 */
window.addEventListener('load', () => {
    console.log('DOM has loaded');
    document.body.appendChild(component());
    myCustomElemnts();
    // document.querySelector('#btnValidate').addEventListener('click', () => {
    //     console.log('clicked');
    // });   
})