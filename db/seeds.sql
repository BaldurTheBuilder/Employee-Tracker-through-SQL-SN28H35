INSERT INTO department (name)
VALUES ("Sales"),
       ("Warehouse"),
       ("Accounting"),
       ("I.T.");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales_Manager",100000.00,1),
       ("Salesman",40000.00,1),
       ("Warehouse_Manager",100000.00,2),
       ("Warehouse_Worker",65000.00,2),
       ("Accountant",70000.00,3),
       ("Tech_Support",250000.10,4);

INSERT INTO employees (first_name,last_name,role_id,manager_id)
VALUES ("Walter","White",1,NULL),
       ("Jessie","Pinkman",2,1),
       ("Saul","Goodman",2,1),
       ("Skyler","White",3,NULL),
       ("Walt Junior","White",4,2),
       ("Marie","Schrader",4,2),
       ("Mike","Ehrmantraut",5,NULL),
       ("Gus","Fring",5,NULL),
       ("Badger",NULL,6,NULL);