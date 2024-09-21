def imld_callback(name:str, *, status:float=None, data:dict=None, msg:str=None) -> bool:
    '''
    function: imld_callback

    args:
     name (str)     : the name of the callback so the client can identify the return.
     data (dict)    : a dictionary containing any pieces of data to be returned to the client.
                      the client should know what to do with this data. the object will not be
                      modified before reaching the client.
     msg (str)      : a descriptive message that will be returned to the client. should key the
                      client in on the status of the function.
     status (float) : a float value representing the percentage of the function that has been
                      completed. this value should be between 0 and 1.

    returns:
     bool: True if the function succeeds, False if it fails.

    description:
     this function is a callback from ML Tools into IMLD. this function will be used to send
     data to the IMLD client as the function progresses. messages, data, and a status percentage
     should be included to be sent to IMLD. these callbacks will be helpful in updating the
     progress bar in the IMLD client. this function should be called stategically throughout the
     ML Tools functions. 
    '''

    # the function logic will be improved in the future
    print(f"Status Update: [{name}] {msg} ({status*100}%)")

    return True

#
# end of function