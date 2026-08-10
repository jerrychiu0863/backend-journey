CREATE TABLE student (
  id SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT
);

-- One to One --
CREATE TABLE contact_detail (
  id INTEGER REFERENCES student(id) UNIQUE,
  tel TEXT,
  address TEXT
);

-- Data --
INSERT INTO student (first_name, last_name)
VALUES ('Jerry', 'Chiu')
INSERT INTO contact_detail (id, tel, address)
VALUES (1, '+352524236', '120 happy Road')

-- Join --
SELECT *
FROM student
JOIN contact_detail
ON student.id = contact_detail.id

-- Many to One --
CREATE TABLE homework_submission (
  id SERIAL PRIMARY KEY,
  mark INTEGER,
  student_id INTEGER REFERENCES student(id)
)

-- Data --
INSERT INTO homework_submission (mark, student_id)
VALUES (98,1) (87,1) (88,1)

-- Join --
SELECT student.id, first_name, last_name, mark
FROM student
JOIN homework_submission
ON student.id = student_id

-- Many to Many --
CREATE TABLE class (
  id SERIAL PRIMARY KEY,
  title VARCHAR(45)
)

CREATE TABLE enrollment (
  student_id INTEGER REFERENCES student(id),
  class_id INTEGER REFERENCES class(id),
  PRIMARY KEY (student_id, class_id)
)

-- Data --
INSERT INTO student (first_name, last_name)
VALUES ('Jack', 'Bauer');

INSERT INTO class (title)
VALUES ('English'), ('Maths'), ('Science')

INSERT INTO enrollment (student_id, class_id)
VALUES (1,1), (1,2)

INSERT INTO enrollment (student_id, class_id)
VALUES (2,2), (2,3)

-- Join --
SELECT * 
FROM enrollment
JOIN student ON enrollment.student_id = student.id
JOIN class ON enrollment.class_id = class.id