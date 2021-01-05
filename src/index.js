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
        box-sizing: border-box;
    }

    input {
        background-color: transparent;
    }

    a {
       text-align: center;
       line-height: 35px;
       color: #fff;
       text-decoration: none;
       background-color: #83b735;
    }

    label {
        display: block;
        margin-bottom: 5px;
        color: #464646;
        vertical-align: middle;
        font-weight: 400;
        font-size: 14px;
        margin-top: 18px;
    }

    input,
    a {
        display: block;
        padding: 0 15px;
        max-width: 100%;
        width: 100%;
        height: 42px;
        border: 2px solid rgba(129,129,129,.2);
        border-radius: 0;
        box-shadow: none;
        vertical-align: middle;
        font-size: 14px;
        transition: border-color .5s ease;
    }
    </style>
    <slot></slot><!-- slotted content appears here -->
    <p id="msg" style="color:red;"></p>
    <label>Fullname</label>
    <input type="text" name="fullname" id="fullname" placeholder="">
    
    <label>Email Or Phone</label>
    <input type="text" name="email" id="email" placeholder="">

    <label>Code</label>
    <input type="text" name="code" id="code" placeholder="" value="">

    <br/>
    <a href="javascript:" id="btnValidate">Validate</button>
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
            this.msg = val;
            this.msgHolder.innerText = val;
        }

        run() {
            if (
                this.txtEmail.value === "" ||
                this.txtCode.value === "") {
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
                    } else {
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
//window.addEventListener('load', () => {
    console.log('DOM has loaded');
    document.body.appendChild(component());
    myCustomElemnts();
    // document.querySelector('#btnValidate').addEventListener('click', () => {
    //     console.log('clicked');
    // });   
//})