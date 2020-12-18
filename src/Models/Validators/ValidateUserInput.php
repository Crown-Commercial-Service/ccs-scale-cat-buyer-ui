<?php

namespace App\Models\Validators;

class ValidateUserInput
{
    private $isValid = false;
    private $errorMessage = '';

    public function __construct(array $userInput)
    {
        $this->validate($userInput);
        if(empty($this->isValid)){
            $this->setErrorMessage();
        }
    }

    /**
     * Return validation result
     *
     * @return boolean
     */
    public function isValid()
    {
        return $this->isValid;
    }

    /**
     * If a validation is failed return a error message
     *
     * @return string
     */

    private function setErrorMessage(){
        $this->errorMessage = ErrorMessages::EMPTY_USER_ANSWER;
    }

    public function getErrorMessage()
    {
        return $this->errorMessage;
    }

    private function validate(array $userInput){

        $this->isValid = empty($userInput) ? false : true;
    }
}
