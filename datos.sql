-- Inserción de datos para la tabla users
INSERT INTO users (name, surname, username, email, password, avatarURL) VALUES
                                                                            ('John', 'Doe', 'johndoe', 'john.doe@example.com', 'password123', 'http://example.com/avatar1.png'),
                                                                            ('Jane', 'Smith', 'janesmith', 'jane.smith@example.com', 'password456', 'http://example.com/avatar2.png'),
                                                                            ('Alice', 'Johnson', 'alicej', 'alice.johnson@example.com', 'password789', 'http://example.com/avatar3.png'),
                                                                            ('Bob', 'Brown', 'bobbrown', 'bob.brown@example.com', 'password321', 'http://example.com/avatar4.png'),
                                                                            ('Charlie', 'Davis', 'charlied', 'charlie.davis@example.com', 'password654', 'http://example.com/avatar5.png'),
                                                                            ('Diana', 'Evans', 'dianae', 'diana.evans@example.com', 'password987', 'http://example.com/avatar6.png'),
                                                                            ('Emily', 'Fox', 'emilyf', 'emily.fox@example.com', 'passwordabc', 'http://example.com/avatar7.png');

-- Inserción de datos para la tabla groups
INSERT INTO groups (group_name, imgURL, amount, currency) VALUES
                                                              ('Group Alpha', '/images/bg2.jpg', 100.0, 'USD'),
                                                              ('Group Beta', '/images/bg3.jpg', 200.0, 'EUR'),
                                                              ('Group Gamma', '/images/bg4.jpg', 150.0, 'USD'),
                                                              ('Group Delta', '/images/bg5.jpg', 250.0, 'EUR'),
                                                              ('Group Epsilon', '/images/bg6.jpg', 300.0, 'USD'),
                                                              ('Group Zeta', '/images/bg7.jpg', 400.0, 'EUR'),
                                                              ('Group Eta', '/images/bg8.jpg', 350.0, 'USD'),
                                                              ('Group Theta', '/images/bg9.jpg', 450.0, 'EUR');

-- Inserción de datos para la tabla group_members
INSERT INTO group_members (user_id, group_id, join_date) VALUES
                                                             (1, 1, '2023-01-15'),
                                                             (2, 1, '2023-01-16'),
                                                             (1, 2, '2023-02-10'),
                                                             (3, 2, '2023-02-11'),
                                                             (2, 3, '2023-03-05'),
                                                             (4, 4, '2023-04-10'),
                                                             (5, 5, '2023-05-20'),
                                                             (6, 6, '2023-06-15'),
                                                             (7, 7, '2023-07-01');

-- Inserción de datos para la tabla expenses
INSERT INTO expenses (amount, expense_name, expense_date, origin_user, group_id, share_method) VALUES
                                                                                                   (50.0, 'Dinner', '2023-06-20', 1, 1, 'PARTESIGUALES'),
                                                                                                   (120.0, 'Concert Tickets', '2023-06-22', 2, 1, 'PORCENTAJES'),
                                                                                                   (30.0, 'Groceries', '2023-07-10', 3, 2, 'PARTESIGUALES'),
                                                                                                   (80.0, 'Office Supplies', '2023-07-20', 4, 4, 'PARTESIGUALES'),
                                                                                                   (150.0, 'Weekend Trip', '2023-08-15', 5, 5, 'PORCENTAJES'),
                                                                                                   (60.0, 'Birthday Party', '2023-09-10', 6, 6, 'PARTESIGUALES');

-- Inserción de datos para la tabla expenses_share
INSERT INTO expenses_share (expense_id, destiny_user_id, assigned_amount) VALUES
                                                                              (1, 1, 25.0),
                                                                              (1, 2, 25.0),
                                                                              (2, 1, 60.0),
                                                                              (2, 2, 60.0),
                                                                              (3, 3, 30.0),
                                                                              (4, 4, 40.0),
                                                                              (4, 5, 40.0),
                                                                              (5, 5, 75.0),
                                                                              (5, 6, 75.0),
                                                                              (6, 6, 30.0),
                                                                              (6, 7, 30.0);