# Modelos e Tabelas (Laravel Models)

## User

  App\Models\User ........................  
  Database ........................ sqlite  
  Table ............................ users  

  Attributes ................. type / cast  
  id increments, unique .... integer / int  
  name fillable .................. varchar  
  email unique, fillable ......... varchar  
  email_verified_at nullable  datetime / datetime  
  password fillable, hidden  varchar / hashed  
  remember_token nullable, hidden  varchar  
  created_at nullable  datetime / datetime  
  updated_at nullable  datetime / datetime  

  Relations ..............................  
  notifications MorphMany  Illuminate\Notifications\DatabaseNotification  

  Events .................................  

  Observers ..............................  

